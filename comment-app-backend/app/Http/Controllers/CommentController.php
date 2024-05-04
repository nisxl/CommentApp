<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        // Retrieve all comments with their replies recursively
        $comments = Comment::with('replies')->get();
    
        // Filter out top-level comments (comments without a parent)
        $topLevelComments = $comments->filter(function ($comment) {
            return is_null($comment->parent_id);
        });
    
        // Create a hierarchical structure for comments
        $hierarchicalComments = $topLevelComments->map(function ($comment) use ($comments) {
            return $this->buildCommentTree($comment, $comments);
        });
    
        return response()->json($hierarchicalComments);
    }
    
    // Helper method to recursively build comment tree
    protected function buildCommentTree($comment, $comments)
    {
        $replies = $comment->replies->map(function ($reply) use ($comments) {
            return $this->buildCommentTree($reply, $comments);
        });
    
        return [
            'id' => $comment->id,
            'title' => $comment->title,
            'content' => $comment->content,
            'updated_at' => $comment->updated_at,
            'replies' => $replies,
        ];
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
