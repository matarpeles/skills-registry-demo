"""Helper utilities for Port self-service action workflows."""

import os
import json
import urllib.request

PORT_API = "https://api.port.io/v1"


def get_headers() -> dict:
    token = os.environ.get("PORT_CLIENT_TOKEN", "")
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def get_entity(blueprint: str, identifier: str) -> dict:
    url = f"{PORT_API}/blueprints/{blueprint}/entities/{identifier}"
    req = urllib.request.Request(url, headers=get_headers())
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())["entity"]


def upsert_entity(blueprint: str, identifier: str, properties: dict, relations: dict = None) -> dict:
    payload = json.dumps({
        "identifier": identifier,
        "properties": properties,
        "relations": relations or {}
    }).encode()
    url = f"{PORT_API}/blueprints/{blueprint}/entities?upsert=true"
    req = urllib.request.Request(url, data=payload, headers=get_headers(), method="POST")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())
