import h2d.Bitmap;

class Main extends hxd.App {
    var bmp: h2d.Bitmap;
    var tf: h2d.Text;

    var velocity: Float = 0;
    var gravity: Float = 9.8;

    var chunkSize: Float = 100;

    var MAX_Y = 1000;

    override function init() {
        // Create some simple text
        tf = new h2d.Text(hxd.res.DefaultFont.get(), s2d);

        // Create a red texture and tile of size 100x100
        var tile = h2d.Tile.fromColor(0xFF0000, 50, 50);
        tile.dx =  - tile.width / 2;
        tile.dy = - tile.height / 2;

        // Create a bitmap object and add it to the default 2d scene
        bmp = new Bitmap(tile, s2d);

        bmp.x = s2d.width * 0.5;
        bmp.y = s2d.height * 0.5;
    }

    override function update(dt: Float) {
        bmp.y += velocity * chunkSize * dt;
        velocity += gravity * dt;
        
        
        tf.text = "Position(" + bmp.x + "," + bmp.y + ")";
        
        if(bmp.y + bmp.tile.y > s2d.height){
            velocity = -velocity * 0.75;
        }
        
    }

    static function main() {
        new Main();
    }

    function sayHelloWorld() {
        // Some old code to display Hello World
        
        
    }
}