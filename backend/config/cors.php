<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://allianz-platform.vercel.app',
    ],

    'allowed_headers' => ['*'],

];