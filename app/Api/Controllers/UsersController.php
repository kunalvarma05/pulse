<?php
namespace Pulse\Api\Controllers;

use Pulse\Models\User;
use Dingo\Api\Facade\API;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsersController extends BaseController
{

    /**
     * Show User
     * @param  Request $request
     * @param  User ID  $id      ID of the user to show
     * @return Response
     */
    public function show(Request $request, $id = null)
    {
        $user = false;

        //No ID Provided
        if(is_null($id)){
            //Current User
            $user = JWTAuth::parseToken()->authenticate();
        } else {
            //Find User by ID
            $user = User::find($id);
        }

        //User not found
        if(!$user) {
            return response()->json(['error' => 'user_not_found', 'message' => "User not found!"], 400);
        }

        //Response
        return response()->json(compact('user'));
    }

    /**
     * Delete User
     * @param  Request $request
     * @param  User ID  $id      ID of the user to delete
     * @return Response
     */
    public function delete(Request $request, $id = null)
    {
        //Delete the user
        if(!User::destroy($id)) {
            return response()->json(['error' => 'could_not_delete_user', 'message' => "Cannot delete user!"], 500);
        }

        //Response
        return response()->json(['message' => "User Deleted"]);
    }

}