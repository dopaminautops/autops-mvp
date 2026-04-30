import json
import re
from dataclasses import dataclass

from transformers import pipeline

from app.core.config import settings


@dataclass
class ParsedResult:
    workflow: dict
    confidence: float


class NLPEngine:
    def __init__(self):
        self.generator = pipeline("text2text-generation", model=settings.hf_model_path)

    def parse(self, user_text: str) -> ParsedResult:
        prompt = (
            "Convert this automation request into JSON with trigger, actions, conditions, tools, "
            f"and parameters: {user_text}"
        )
        output = self.generator(prompt, max_new_tokens=220)[0]["generated_text"]
        try:
            workflow = json.loads(output)
            return ParsedResult(workflow=workflow, confidence=0.85)
        except Exception:
            return self._fallback_rule_parser(user_text)

    def _fallback_rule_parser(self, text: str) -> ParsedResult:
        lowered = text.lower()
        trigger_app = "gmail" if "email" in lowered or "gmail" in lowered else "manual"
        actions = []
        if "sheet" in lowered:
            actions.append({"app": "google_sheets", "action": "append_row", "parameters": {}})
        if "slack" in lowered:
            actions.append({"app": "slack", "action": "send_message", "parameters": {"channel": "{{ask}}"}})
        agent_needed = bool(re.search(r"summari|decide|urgency|classif", lowered))
        if agent_needed:
            actions.append({"app": "llm_agent", "action": "infer", "parameters": {"prompt": "{{ask}}"}})
        workflow = {
            "trigger": {"app": trigger_app, "event": "new_event"},
            "actions": actions or [{"app": "notification", "action": "send", "parameters": {}}],
            "conditions": [],
            "tools": sorted({trigger_app, *[a["app"] for a in actions]}),
        }
        return ParsedResult(workflow=workflow, confidence=0.45)


engine = NLPEngine()
