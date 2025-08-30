
bl_info = {
    "name": "BlendTools Bridge",
    "author": "Your Name",
    "version": (1, 0, 0),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar > BlendTools",
    "description": "Connects Blender to the BlendTools web interface.",
    "warning": "",
    "wiki_url": "",
    "category": "System",
}

import bpy
from . import ui, websocket_server, auth

def register():
    """Registers the add-on."""
    bpy.utils.register_class(ui.BlendToolsPanel)
    bpy.utils.register_class(ui.BlendToolsPreferences)
    auth.register()
    websocket_server.start_server()

def unregister():
    """Unregisters the add-on."""
    bpy.utils.unregister_class(ui.BlendToolsPanel)
    bpy.utils.unregister_class(ui.BlendToolsPreferences)
    auth.unregister()
    websocket_server.stop_server()

if __name__ == "__main__":
    register()
