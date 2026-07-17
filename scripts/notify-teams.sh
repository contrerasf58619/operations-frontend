#!/usr/bin/env bash
# Post a deployment status card to a Microsoft Teams channel via a Workflows webhook.
#
# Usage: notify-teams.sh STATUS ENVIRONMENT BRANCH_FLOW REPO COMMIT_SHA ACTOR [RUN_URL]
#   STATUS      started | success | failure
#   RUN_URL     optional link to the CI run, rendered as a card button
#
# Reads TEAMS_WEBHOOK_URL from the environment. The webhook URL is never printed.
# Always exits 0 — a failed notification must never fail the pipeline.

set -u

STATUS="${1:-}"
ENVIRONMENT="${2:-}"
BRANCH_FLOW="${3:-}"
REPO="${4:-}"
COMMIT_SHA="${5:-}"
ACTOR="${6:-}"
RUN_URL="${7:-}"

warn() {
    echo "::warning:: $*"
}

if [ -z "${TEAMS_WEBHOOK_URL:-}" ]; then
    warn "TEAMS_WEBHOOK_URL is not set - skipping Teams notification"
    exit 0
fi

case "$STATUS" in
    started)
        TITLE="🚀 ${ENVIRONMENT} deployment started"
        COLOR="Accent"
        ;;
    success)
        TITLE="✅ ${ENVIRONMENT} deployment completed"
        COLOR="Good"
        ;;
    failure)
        TITLE="❌ ${ENVIRONMENT} deployment FAILED"
        COLOR="Attention"
        ;;
    *)
        warn "Unknown status '${STATUS}' - skipping Teams notification"
        exit 0
        ;;
esac

TIMESTAMP="$(TZ=America/Guatemala date +"%Y-%m-%d %H:%M")"

if command -v jq >/dev/null 2>&1; then
    PAYLOAD="$(jq -n \
        --arg title "$TITLE" \
        --arg color "$COLOR" \
        --arg repo "$REPO" \
        --arg flow "$BRANCH_FLOW" \
        --arg environment "$ENVIRONMENT" \
        --arg sha "$COMMIT_SHA" \
        --arg actor "$ACTOR" \
        --arg time "$TIMESTAMP" \
        --arg runUrl "$RUN_URL" \
        '{
            type: "message",
            attachments: [{
                contentType: "application/vnd.microsoft.card.adaptive",
                content: ({
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    type: "AdaptiveCard",
                    version: "1.4",
                    body: [
                        {
                            type: "TextBlock",
                            text: $title,
                            weight: "Bolder",
                            size: "Medium",
                            color: $color,
                            wrap: true
                        },
                        {
                            type: "FactSet",
                            facts: [
                                { title: "Repo", value: $repo },
                                { title: "Branch flow", value: $flow },
                                { title: "Environment", value: $environment },
                                { title: "Commit", value: $sha },
                                { title: "Author", value: $actor },
                                { title: "Time", value: $time }
                            ]
                        }
                    ]
                } + (if $runUrl == "" then {} else {
                    actions: [{
                        type: "Action.OpenUrl",
                        title: "View pipeline run",
                        url: $runUrl
                    }]
                } end))
            }]
        }')"
else
    # Fallback without jq. Inputs come from CI-controlled variables, not free text,
    # so plain interpolation is acceptable here.
    ACTIONS_JSON=""
    if [ -n "$RUN_URL" ]; then
        ACTIONS_JSON=",
            \"actions\": [{ \"type\": \"Action.OpenUrl\", \"title\": \"View pipeline run\", \"url\": \"${RUN_URL}\" }]"
    fi

    PAYLOAD="$(cat <<EOF
{
    "type": "message",
    "attachments": [{
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
            "\$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.4",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "${TITLE}",
                    "weight": "Bolder",
                    "size": "Medium",
                    "color": "${COLOR}",
                    "wrap": true
                },
                {
                    "type": "FactSet",
                    "facts": [
                        { "title": "Repo", "value": "${REPO}" },
                        { "title": "Branch flow", "value": "${BRANCH_FLOW}" },
                        { "title": "Environment", "value": "${ENVIRONMENT}" },
                        { "title": "Commit", "value": "${COMMIT_SHA}" },
                        { "title": "Author", "value": "${ACTOR}" },
                        { "title": "Time", "value": "${TIMESTAMP}" }
                    ]
                }
            ]${ACTIONS_JSON}
        }
    }]
}
EOF
)"
fi

# Teams Workflows webhooks return HTTP 202 on success; curl -f accepts any 2xx.
if curl -sf --max-time 15 -o /dev/null \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "$TEAMS_WEBHOOK_URL"; then
    echo "Teams notification sent: ${STATUS} (${ENVIRONMENT})"
else
    warn "Teams notification failed: ${STATUS} (${ENVIRONMENT})"
fi

exit 0
