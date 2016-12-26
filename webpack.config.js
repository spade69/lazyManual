var webpack=require('webpack');
var commonsPlugin=new webpack.optimize.CommonsChunkPlugin({
    filename:"common.js",
    name:"commons"
})
module.exports={
    entry:{
        pageA:'./js/entryA.js',
        pageB:'./js/entryB.js'
    },
    output:{
        path:path.join(__dirname,"js"),
        filename:"[name].bundle.js",
        chunkFilename:"[id].chunk.js"
    },
    module:{
        loaders:[
            {test:/\.css$/,loader:'style!css'}
        ]
    },
    plugins:[commonsPlugin]
}