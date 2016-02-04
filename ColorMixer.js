


var DIM = 30;
var SPEED = 10;
var WIDTH = window.innerWidth-SPEED-DIM;
var HEIGHT = window.innerHeight-SPEED-DIM;
var NUMSQUARES = Math.floor(((WIDTH*HEIGHT)/10)/(DIM*DIM)); /* want about 1/10 of the entire screen's area to be filled */


var Square = React.createClass ({
    render: function() {
        var style = {
            width: DIM + "px",
            height: DIM + "px", 
            backgroundColor: this.props.color,
            position: "absolute",
            marginLeft: this.props.horz,
            marginTop: this.props.vert
        };

        return <div style={style}></div>;
    }
});

var WhiteSquare = React.createClass ({
    render: function() {
        var style = {
            width: DIM + "px",
            height: DIM + "px", 
            backgroundColor: "#ffffff",
            position: "absolute",
            marginLeft: WIDTH/2,
            marginTop: HEIGHT/2,
            border: "solid 1px #000"
        };

        return <div style={style}></div>;
    }
});

var MovingSquare = React.createClass({
    render: function() {
        var style = {
            position: "absolute",
            marginLeft: this.props.horz,
            marginTop: this.props.vert
        };

        var sqStyle = {
            width: DIM + "px",
            height: DIM + "px", 
            backgroundColor: this.props.color,
            position: "absolute",
            border: "solid 1px #000"
        };

        return <div style={style}><div style={sqStyle}></div></div>;
    }
});

var App = React.createClass ({
    getInitialState: function() {
        var min = SPEED;
        var squares = [];

        for (var i=0; i<NUMSQUARES; i++) {
            var square = {};
            square.horz = Math.floor(Math.random() * (WIDTH - min + 1)) + min;
            square.vert = Math.floor(Math.random() * (HEIGHT - min + 1)) + min;
            square.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

            squares.push(square);
        }

        return {
          squares: squares,
          horz: WIDTH/2,
          vert: HEIGHT/2,
          color: "#ffffff"
      };
  },

  componentDidMount: function() {
    ReactDOM.findDOMNode(this).offsetParent.addEventListener('keypress', function (e) {
        var intKey = (window.Event) ? e.which : e.keyCode;
        this.move(intKey);
    }.bind(this));
},

move: function(key) {
    if (key === 100 && this.state.horz<WIDTH) { /* right - D */
      this.setState ({
        horz: this.state.horz+SPEED
    });
  }
  else if (key === 97 && this.state.horz>SPEED) { /* left - A */
      this.setState ({
        horz: this.state.horz-SPEED
    });
  }
  else if (key === 119 && this.state.vert>SPEED) { /* up - W */
      this.setState ({
        vert: this.state.vert-SPEED
    });
  }
  else if (key === 115 && this.state.vert<HEIGHT) { /* down - S */
      this.setState ({
        vert: this.state.vert+SPEED
    });
  }

  this.checkCollision();
},

checkCollision: function() {
    for (var i=0; i<this.state.squares.length; i++) {
        var s = this.state.squares[i];
        /* collides with anohter square */
        if ((this.state.horz<s.horz+DIM && this.state.horz>s.horz-DIM) && (this.state.vert<s.vert+DIM && this.state.vert>s.vert-DIM)) {

            /* mix hex color */
            var hexStr = (parseInt(this.state.color.slice(1), 16) + parseInt(s.color.slice(1), 16));
            if (this.state.color=="#ffffff") {
                hexStr = s.color;
            }
            else {
                hexStr = hexStr.toString(16);
                hexStr = hexStr.slice(1);
                while (hexStr.length < 6) /* add initial zeroes */
                    hexStr = '0' + hexStr;
                hexStr = "#" + hexStr;
            }

            this.state.squares.splice(i, 1);
            this.setState ({
                color: hexStr,
                squares: this.state.squares
            });

            break;
        }
        /* collides with white box */
        else if (this.state.color!=="#ffffff" && (this.state.horz<WIDTH/2+DIM && this.state.horz>WIDTH/2-DIM) && (this.state.vert<HEIGHT/2+DIM && this.state.vert>HEIGHT/2-DIM)) {
            this.setState ({
                color: "#ffffff"
            });
        }
    }
},

render: function() {
    var squares = [];
    for (var i=0; i<this.state.squares.length; i++) {
        var s = this.state.squares[i];
        var square = <Square horz={s.horz} vert={s.vert} color={s.color}/>;
        squares.push( square );
    }

    return (<div>
        <WhiteSquare />
        {squares}
        <MovingSquare horz={this.state.horz} vert={this.state.vert} color={this.state.color}/>
        </div>
        );
}
});


ReactDOM.render(
    <App />,
    document.getElementById("main")
    );


