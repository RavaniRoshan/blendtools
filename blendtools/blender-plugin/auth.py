
import bpy
import json

# This would be stored securely in production
SECRET_TOKEN = "my-secret-token"

authenticated_clients = set()

def register():
    """Registers the add-on's properties."""
    bpy.types.Scene.blendtools_auth_token = bpy.props.StringProperty(
        name="Auth Token",
        description="Authentication token for the BlendTools bridge",
        default=SECRET_TOKEN,
    )

def unregister():
    """Unregisters the add-on's properties."""
    del bpy.types.Scene.blendtools_auth_token

async def authenticate(websocket, message):
    """Authenticates a client based on the provided token."""
    if websocket in authenticated_clients:
        return True

    try:
        data = json.loads(message)
        if data.get("type") == "auth" and data.get("token") == SECRET_TOKEN:
            authenticated_clients.add(websocket)
            await websocket.send(json.dumps({"type": "auth_success"}))
            return True
        else:
            await websocket.send(json.dumps({"type": "auth_failed"}))
            return False
    except json.JSONDecodeError:
        await websocket.send(json.dumps({"error": "Invalid JSON for auth"}))
        return False
