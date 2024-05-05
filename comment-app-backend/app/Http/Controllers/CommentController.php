<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        // Retrieve all comments along with their replies
        $comments = Comment::whereNull('parent_id')->with('replies')->get();
    
        return response()->json($comments);
    }
    




    public function getRepliesForParent($parentId)
    {
        // Query the database to find replies for the specified parent comment
        $replies = Comment::where('parent_id', $parentId)->get();

        // Return the replies
        return response()->json($replies);
    }

    public function store(Request $request)
    {
        $comment = Comment::create($request->all());
        return response()->json($comment, 201);
    }

    public function reply(Request $request, $parentId)
{
    // Validate the request data
    $request->validate([
        'title' => 'required',
        'content' => 'required',
    ]);

    try {
        // Create the reply with the provided parent ID
        $reply = Comment::create([
            'title' => $request->title,
            'content' => $request->content,
            'parent_id' => $parentId,
        ]);

        // Return the newly created reply with a success response
        return response()->json($reply, 201);
    } catch (\Exception $e) {
        // Handle any exceptions (e.g., database errors) and return an error response
        return response()->json(['error' => 'Failed to create reply.'], 500);
    }
}

}
