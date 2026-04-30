REQUIRED_SLOTS = ["trigger", "actions", "tools"]


def missing_slots(workflow: dict) -> list[str]:
    return [slot for slot in REQUIRED_SLOTS if slot not in workflow or not workflow.get(slot)]
