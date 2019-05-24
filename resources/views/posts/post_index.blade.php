@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          
          <h2>Posts</h2>
          <hr>

          @forelse ($posts as $post)

            <h3 style="margin-bottom:-3px;">
              <a href="{{ '/blog/posts/'. $post->id }}">{{ $post->title }}</a>

              <!-- Edit buttons if user is admin -->
              @if( (isset(Auth::user()->admin)) && Auth::user()->admin->active == 1)
                - <small><a href="{{ '/blog/posts/'.$post->id.'/edit' }}"> Edit</a></small>
              @endif

            </h3>

            <small>
              {{ $post->author->firstname }} {{ $post->author->lastname }} - {{ $post->created_at->format('Y-m-d') }}
            </small>

            <br>

            @if (!empty($post->tags[0]))

              <div id="tags-list">
                  <small>Tags:
                  @foreach ($post->tags as $tag)

                    @if ($loop->last)
                    <a href="{{ '/blog/tag/' . urlencode($tag->tag) }}"> {{ $tag->tag }} </a>
                    @else
                    <a href="{{ '/blog/tag/' . urlencode($tag->tag) }}"> {{ $tag->tag }} </a> -
                    @endif
                  @endforeach
                </small>
              </div>

            @endif

            <div>
              {{ substr(strip_tags( \App\Post::select('post_body')->where('id', '=', $post->id)->get()[0]->post_body ), 0, 200) }}...
            </div>
            <hr>

          @empty
            <p>No blog posts :(</p>
          @endforelse

          {{ $posts->links() }}

        </div>
    </div>
</div>

@endsection
