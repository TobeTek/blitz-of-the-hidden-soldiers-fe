import mycustom.MyMath;
import js.Browser;


class Main extends hxd.App {
    override function init() {
        
        // Web3Lib.setup();
        // var w3 = Web3Lib.createInstance();
        // var w3 = cast(untyped __js__("new Web3()"), Web3);
        
        // trace(
        //     w3.currentProvider,
        //     w3.isConnected(),
        //     w3.sha3("Welcome")
        //     );
        var tf = new h2d.Text(hxd.res.DefaultFont.get(), s2d);
        tf.text = "Hello World !" + " " + CustomMath.PI;
        
        // tf.text = "Res: " + Math.floor(19.188) + " " + Web3.isMetaMask() + " " + Browser.window.document.bgColor;
        // Browser.document.bgColor = "red";

        
    }

    static function main() {
        new Main();
    }
}