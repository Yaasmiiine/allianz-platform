<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->notifications()->latest()->get();
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()->update(['is_read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    public function clearAll(Request $request)
    {
        $request->user()->notifications()->delete();

        return response()->json([
            'message' => 'All notifications cleared',
        ]);
    }
}