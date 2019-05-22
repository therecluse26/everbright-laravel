<?php

namespace App\Http\Middleware;

use Closure;

class CheckAdmin
{
    /**
     * Redirects from admin pages if user is not an admin
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!\Auth::check() || !\Auth::user()->isAdmin()) {
            return redirect('/');
        }
        return $next($request);
    }
}
