
import bpy
from . import websocket_server

class BlendToolsPreferences(bpy.types.AddonPreferences):
    bl_idname = __package__

    auth_token: bpy.props.StringProperty(
        name="Auth Token",
        description="Authentication token for the BlendTools bridge",
        default="my-secret-token",
    )

    def draw(self, context):
        layout = self.layout
        layout.prop(self, "auth_token")

class BlendToolsPanel(bpy.types.Panel):
    """Creates a Panel in the 3D View's Sidebar"""
    bl_label = "BlendTools"
    bl_idname = "VIEW3D_PT_blendtools"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'BlendTools'

    def draw(self, context):
        layout = self.layout

        row = layout.row()
        row.label(text="Connection Status:")

        status = "Connected" if websocket_server.clients else "Disconnected"
        row.label(text=status)

        row = layout.row()
        row.operator("wm.url_open", text="Open BlendTools").url = "http://localhost:3000"

def register():
    bpy.utils.register_class(BlendToolsPreferences)
    bpy.utils.register_class(BlendToolsPanel)

def unregister():
    bpy.utils.unregister_class(BlendToolsPreferences)
    bpy.utils.unregister_class(BlendToolsPanel)
