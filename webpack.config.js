var webpack=require('webpack');

module.exports={
    entry:'./js/entry.js',
    output:{
        path:__dirname,
        filename:'index.js'
    },
    module:{
        loaders:[
            {test:/\.css$/,loader:'style!css'}
        ]
    }
}