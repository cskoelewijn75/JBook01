let dRaster = 50;
let XschaalFactor = 0.02;
let YschaalFactor = 0.02;
let xb, yb, xe, ye;
let x, y;
let Xpos =0 , Ypos = 0;
let angle = 0;
let t1 = 0; let t2 = 0;
let a2 = 0;
let nt1 = 0, nt2 = 0, na2 = 0;
let txtt1 = "<i>&theta;</i><sub>1</sub>"
let txtt2 = "<i>&theta;</i><sub>2</sub>"
let r1 = 3;
let r2 = 1;
let r3 = 0.5;
let drawSpoor = false;
let oorsprong;
let xSpoor, ySpoor, xSpoorPrev, ySpoorPrev;
let canvasPos;


function setup() {
  cnv = createCanvas(700, 700);
  canvasPos = cnv.position();


  extraCanvas = createGraphics(700, 700);  // voor spoor
  extraCanvas.clear();
  extraCanvas.stroke(0,100,220);
  oorsprong = createVector(width/2, height/2);
  extraCanvas.translate(oorsprong.x, oorsprong.y); 
  extraCanvas.scale(1,-1);
  
  var ouderdiv = select('#tekenvak');
    // Voeg het canvas toe aan de ouder div
    //cnv.parent(ouderdiv);
        //extraCanvas.parent(ouderdiv);
    ouderdiv.child(cnv);
    ouderdiv.child(extraCanvas);


  var sld1 = document.getElementById("sld1");
  var sld2 = document.getElementById("sld2");
  var lbl_r1r2 = document.getElementById("r1r2");
  r1 = sld1.value/20;
  r2 = sld2.value/20;
  lbl_r1r2.innerHTML = r1 +" : " + r2;


  sld1.oninput = function() {
    document.getElementById("chbSpoor").checked = false; drawSpoor = false;
    r1 = this.value/20;
    lbl_r1r2.innerHTML = r1 + " : "+ r2;
    document.getElementById("invSld1").value = r1;
  }
  sld2.oninput = function() {
    document.getElementById("chbSpoor").checked = false; drawSpoor = false;
    r2 = this.value/20;
    lbl_r1r2.innerHTML = r1 + " : "+ r2;
    document.getElementById("invSld2").value = r2;  
  }

  var chb = document.getElementById("chbSpoor");
  chb.oninput = function() {
    if (this.checked) {
         drawSpoor = true;
    } else {
        drawSpoor = false;
    }
  }

  document.getElementById('invSld1').addEventListener('change', verwerkInvoer);
  document.getElementById('invSld2').addEventListener('change', verwerkInvoer);

  xSpoor = r1; ySpoor = 0;
}

function draw() {
  background(220);
  fill(255,0,0);
  image(extraCanvas,0,0);
  
  translate(oorsprong.x, oorsprong.y);
  scale(1,-1);


  if (document.getElementById("chbAssen").checked){
    drawAssen();
  }

  x = (r1+r2)*cos(t1);
  y = (r1+r2)*sin(t1);
  xSpoorPrev = xSpoor; ySpoorPrev = ySpoor;
  xSpoor = x-r2*cos(a2); ySpoor = y+r2*sin(-a2);

  stroke(40,40,40);
  strokeWeight(1.2);
  // Referentielijnen en voerstraal
    if (document.getElementById("chbHoek_t1").checked){
      lijn(0,0,r1,0);   //horizontaal ref.lijntje langs straal cirkel1
    }
    if (document.getElementById("chbVoerstraal").checked){
      lijn(0,0,x,y);  // voerstraal
    }
  stroke(255, 165, 0);
  if (document.getElementById("chbReflijn").checked){
    lijn(x-r2,y,x,y); // referentielijn voor rotatie angle2
  } 
  
  strokeWeight(2);
  stroke('#03A9F4');
  //Cirkel 1
  if (document.getElementById("chbCirkel1").checked){
    cirkel(0,0,r1);
  }
  stroke(25,0,225);
  //Cirkel 2 
  if (document.getElementById("chbCirkel2").checked){
    cirkel(x,y,r2);
  }  
  
  
  stroke(0,0,0);
  strokeWeight(4);
  // Punten aan de omtrek van de rolcirkel
  if (document.getElementById("chbCirkel2pnt").checked){
    for (let i=0; i<8; i++){
      xpunt = x+ r2*cos(a2+i*PI/4); ypunt = y+r2*sin(a2+i*PI/4);
      punt(xpunt,ypunt);
    }
  }


  stroke(25,0,225);
  strokeWeight(2);
  // Spaken in rolcirkel
    if (document.getElementById("chbSpaak1").checked){
      xb = x-r2*cos(a2); yb =y+r2*sin(-a2);
      xe = x-r2*cos(a2+PI); ye =y+r2*sin(-a2+PI);
      lijn(xb,yb,xe,ye);
    }
    if (document.getElementById("chbSpaak2").checked){
      xb = x+r2*cos(a2-0.5*PI); yb =y+r2*sin(a2-0.5*PI);
      xe = x+r2*cos(a2+0.5*PI); ye =y+r2*sin(a2+0.5*PI);
      lijn(xb,yb,xe,ye);
    }
    if (document.getElementById("chbPijl").checked){
      xe = x-r2*cos(a2); ye =y+r2*sin(-a2);
      pijl(x,y,xe,ye); 
    } 
  

  
  stroke('red');
  noFill();
  // Contactspoor
  if (document.getElementById("chbContactspoor").checked){
    let aantalrotatiest2 = floor(abs(nt2));
    let starthoek = aantalrotatiest2*TWO_PI*r2/r1;
    if (t1 > 0){
      boog(0,0,r1,starthoek,t1,"none");
      boog(x,y,r2,PI+t1,PI+a2, "none");
    } else if (t1 < 0){
      boog(0,0,r1,t1,-starthoek,"none");
      boog(x,y,r2,PI+a2,PI+t1, "none");
    }
  }

  stroke(255, 165, 0);
  // Omtrekspoor hoek alpha
  if (document.getElementById("chbOmtrek_a2").checked){

    if (t1 > 0){
      boog(x,y,r2,PI,PI+a2, "none");
    } else if (t1 < 0){
      boog(x,y,r2,PI+a2,PI, "none");
    }
  }

  stroke('red');
  fill(240,0,0,50);
  // intekenen hoek t1
  if (document.getElementById("chbHoek_t1").checked){
    if (t1 > 0){
      boog(0,0,0.4*r1,0,t1,"eindpijl");
    } else if (t1 < 0){
      boog(0,0,0.4*r1,t1,0,"beginpijl");
    }

    if (document.getElementById("chbSymt1").checked){
        // Positioneren van het symbool van theta1
        canvasPos = cnv.position();
        let t1sym = select('#t1');
        t1sym.style('display', 'block');
        let elw = 0.5*t1sym.width;
        let elh = 0.5*t1sym.height;
        //print( "   canvasPos.y =" + canvasPos.y + "   oorsprong.y =" + oorsprong.y + "   rsin =" + 50 * 0.5 * r1 * sin((t1 / 2)%PI) + "   elh =" + elh);
        let xPos = canvasPos.x + oorsprong.x + 50 * 0.5 * r1 * cos((t1 / 2)%PI)-elw;
        let yPos = canvasPos.y + oorsprong.y - 50 * 0.5 * r1 * sin((t1 / 2)%PI)-elh;
        t1sym.position(xPos, yPos);
    }  else {
      document.getElementById("t1").style.display = "none";
    }
  } else {
    document.getElementById("t1").style.display = "none";
  }


  fill(0, 204, 255,90);
  stroke('#3954EE');
  // intekenen hoek t2 
  if (document.getElementById("chbHoek_t2").checked){
    if (t1 > 0){
      boog(x,y,0.60*r2,PI+t1,PI+a2, "eindpijl");
    } else if (t1 < 0){
      boog(x,y,0.60*r2,PI+a2,PI+t1, "beginpijl");
    }

    if (document.getElementById("chbSymt2").checked){
        // Positioneren van het symbool van theta2
        canvasPos = cnv.position();
        let t2sym = select('#t2');  
        t2sym.style('display', 'block');

        let elw = 0.5*t2sym.width;
        let elh = 0.5*t2sym.height;

        let xPos = canvasPos.x + oorsprong.x + 50*x + 50 * 0.82 * r2 * cos((PI +a2 - (0.5*(a2-t1))%PI) )-elw;
        let yPos = canvasPos.y + oorsprong.y - 50*y - 50 * 0.82 * r2 * sin((PI +a2 - (0.5*(a2-t1))%PI) )-elh;
        //print(xPos + "     " + yPos);
        t2sym.position(xPos, yPos);
    }  else {
      document.getElementById("t2").style.display = "none";
    }

  } else {
    document.getElementById("t2").style.display = "none";
  }


  fill(255, 165, 0,120);
  stroke(255, 165, 0);
  // intekenen hoek a2 
  if (document.getElementById("chbHoek_a2").checked){
    if (t1 > 0){
      boog(x,y,0.3*r2,PI,PI+a2, "eindpijl");
    } else if (t1 < 0){
      boog(x,y,0.3*r2,PI+a2,PI, "beginpijl");
    }

    if (document.getElementById("chbSyma2").checked){
        // Positioneren van het symbool van theta2
        canvasPos = cnv.position();
        let a2sym = select('#a2');  
        a2sym.style('display', 'block');

        let elw = 0.5*a2sym.width;
        let elh = 0.5*a2sym.height;

        let xPos = canvasPos.x + oorsprong.x + 50*x + 50 * 0.48 * r2 * cos((PI +a2 - (0.5*(a2))%PI) )-elw;
        let yPos = canvasPos.y + oorsprong.y - 50*y - 50 * 0.48 * r2 * sin((PI +a2 - (0.5*(a2))%PI) )-elh;
        //print(xPos + "     " + yPos);
        a2sym.position(xPos, yPos);
    }  else {
      document.getElementById("a2").style.display = "none";
    }
  } else {
    document.getElementById("a2").style.display = "none";
  }



  if (drawSpoor){
    extraCanvas.strokeWeight(2);
    extraCanvas.line(xSpoorPrev*50,ySpoorPrev*50, xSpoor*50, ySpoor*50);
    //extraCanvas.circle(xe*50,ye*50,0.5);
  }

  
  if (keyIsPressed){
    if (key === ','){
      a2 = a2 + 0.05;
    }else if(key === '.'){
      a2 = a2 - 0.05;
    } 
  } else {
    let n = round(a2/(PI/24),0);
    a2 = n*(PI/24);
  }

  // Er geldt: s1 = s2 -->  t1*r1 = t2*r2 --> t2 = t1*r1/r2
  // En: a2 = t1 + t2    -->  a2 = t1 + t1*r1/r2 = t1(1 + r1/r2) = t1(r2/r2 + r1/r2)
  // -->  a2 = t1(r1+r2)/r2  -->  t1 = a2*r2/(r1+r2)
  t1 = a2*r2/(r1+r2);
  t2 = t1*r1/r2;

  let hoek_t1 = degrees(t1);
  let hoek_t2 = degrees(t2);
  let hoek_a2 = degrees(a2);


  nt1 = round(hoek_t1/360,2);
  nt2 = round((hoek_a2-hoek_t1)/360,2);
  na2 = round(hoek_a2/360,2);
  
 
  document.getElementById("hoek_t1").textContent = round(hoek_t1,1);
  document.getElementById("hoek_t2").textContent = round(hoek_t2,1);
  document.getElementById("hoek_a2").textContent = round(hoek_a2,1);
  document.getElementById("rad_t1").textContent = round(t1,2);
  document.getElementById("rad_t2").textContent = round(t2,2);
  document.getElementById("rad_a2").textContent = round(a2,2);
  document.getElementById("s1").textContent = round(t1*r1,2);
  document.getElementById("s2").textContent = round(t2*r2,2);

  document.getElementById("hoek_t1ger").textContent = round(hoek_t1%360,1);
  document.getElementById("hoek_t2ger").textContent = round(hoek_t2%360,1);
  document.getElementById("hoek_a2ger").textContent = round(hoek_a2%360,1);
  document.getElementById("rad_t1ger").textContent = round(t1%TWO_PI,2);
  document.getElementById("rad_t2ger").textContent = round(t2%TWO_PI,2);
  document.getElementById("rad_a2ger").textContent = round(a2%TWO_PI,2);


  document.getElementById("nt1").textContent = nt1;
  document.getElementById("nt2").textContent = nt2;
  document.getElementById("na2").textContent = na2;

  document.getElementById("r1").textContent = r1;
  document.getElementById("r2").textContent = r2; 
}




function lijn(x1,y1,x2,y2){
  line(50*x1,50*y1,50*x2,50*y2);
}
function punt(xp,yp){
  point(50*xp,50*yp);
}

function pijl(x1,y1,x2,y2) {
  let v = createVector(x2-x1,y2-y1);
  let r = v.mag();
  push();
  translate(50*x1,50*y1);
  rotate(v.heading());
    line(0,0,50*r,0);
    line(50*r,0,50*r-5,3);
    line(50*r,0,50*r-5,-3);
  pop();
}




function cirkel(x,y,r){
  noFill();
  circle(50*x,50*y,100*r); 
  
}

function boog(x,y,r,a1,a2,pijlmode){
  if (a1 != a2) {
    arc(50*x, 50*y, 100*r, 100*r, a1, a2);
    if (pijlmode == "eindpijl"){
      // Punt P op cirkel (uiterste puntje v.d. pijlpunt)
      let xp = r*cos(a2);
      let yp = r*sin(a2);
      let newxp = x+xp;
      let newyp = y+yp;
      let dA = 0.08/r;
      // Punt Q op cirkel een stukje terug t.o.v. punt P
      let xq = r*cos(a2-dA);
      let yq = r*sin(a2-dA);
      let newxq = x+xq;
      let newyq = y+yq;
      pijl(newxq,newyq,newxp,newyp);
    } 
    else if (pijlmode == "beginpijl"){
      // Punt P op cirkel (uiterste puntje v.d. pijlpunt)
      let xp = r*cos(a1);
      let yp = r*sin(a1);
      let newxp = x+xp;
      let newyp = y+yp;
      let dA = 0.08/r;
      // Punt Q op cirkel een stukje terug t.o.v. punt P
      let xq = r*cos(a1+dA);
      let yq = r*sin(a1+dA);
      let newxq = x+xq;
      let newyq = y+yq;
      pijl(newxq,newyq,newxp,newyp);

    }


  }
}
function mousePressed() {

}
function keyPressed() {
  if (keyCode === CONTROL){
    a2 = 0; t1 = 0;
    extraCanvas.clear();
    xSpoor = r1; ySpoor = 0;
  }
}

function mouseWheel(event) {
  //print(event.delta);
  //angle += (event.delta)/1500;
  let n = round(a2/(PI/24),0);
  a2 = n*(PI/24);
  
  
  if (event.delta > 0){
    a2 += (PI/24);
  } else if (event.delta < 0) {
    a2 -= (PI/24);
  }
  
  t1 = a2*r2/(r1+r2);
  // to block page scrolling
  return false;
}




function drawAssen(){
  strokeWeight(2);
  stroke(0,0,0);
  fill(50,50,50);
  xb = -oorsprong.x;
  xe = width-oorsprong.x;
  ye = oorsprong.y;
  yb = -(height-oorsprong.y);
  //write("LINKS ONDER:  (xb,yb) = (" + round(xb) + " , " + round(yb) + ")" ,50,50,"L");
  //write("RECHTS BOVEN: (xe,ye) = (" + round(xe) + " , " + round(ye) + ")" ,50,100,"L");
  line(xb,0,xe,0);
  triangle(xe,0,xe-10,-2,xe-10,2);
  line(0,yb,0,ye);
  triangle(0,ye,-2,ye-10,2, ye-10);
  strokeWeight(1);
  noFill();
  write("+x", xe-15,-30, "R");
  write("+y", -5,ye-15, "R");
  stroke(50,50,50);
  fill(50,50,50);
  strokeWeight(0.2);
  
  // verticale lijnen raster
  let n = round(xb/dRaster);
  for(i = n*dRaster; i < xe; i = i + dRaster) {
    line(i,yb,i, ye);
    write(i*XschaalFactor, i, -15,"C");
  }
  // horizontale lijnen raster
  n = round(yb/dRaster);
  //print(n);
  for(i = n*dRaster; i < ye; i = i + dRaster) {
    line(xb,i,xe,i);
    write(i*YschaalFactor, -3, i-3, "R");
  }
  
}

function drawFunctie(){
  stroke(0); strokeWeight(2);
  noFill();
  let x, y;
  beginShape();
  for (i = xb; i<xe; i++){
    x = i*XschaalFactor;
    
      // functie
      y = x*x
    
    j = y/YschaalFactor;
    vertex(i,j);
  }
  endShape();
}  
 
function wisSpoor(){
    extraCanvas.clear();
}

function toggleInfo() {
  var div = document.getElementById("uitvoer");
  if (div.style.display == "none") {
      div.style.display = "block";
  } else {
      div.style.display = "none";
  }
}
function schrijf(tekst, xcm, ycm, mode){
write(tekst, xcm*50, ycm*50, mode);
}
function write(tekst, x, y, mode){
  textFont('Courier New',10);
  textStyle(NORMAL);
  if (mode == "C") {textAlign(CENTER)}
  if (mode == "L") {textAlign(LEFT)}
  if (mode == "R") {textAlign(RIGHT)}
  scale(1,-1);
  y = y*-1;
  text(tekst, x, y);
  scale(1,-1);
}




function handleKeyPress(event) {
  if (event.key === 'Enter') {
      event.preventDefault();
      verwerkInvoer();
  }
}

function verwerkInvoer() {
  document.getElementById("chbSpoor").checked = false; drawSpoor = false;
  var invoerWaarde1 = parseFloat(document.getElementById('invSld1').value);
  var invoerWaarde2 = parseFloat(document.getElementById('invSld2').value);
  if (!isNaN(invoerWaarde1) && !isNaN(invoerWaarde2) ) {
      document.getElementById('sld1').value = invoerWaarde1*20;
      document.getElementById('sld2').value = invoerWaarde2*20;
      r1 = invoerWaarde1;
      r2 = invoerWaarde2;
      lbl_r1r2 = document.getElementById("r1r2").innerHTML = r1 + " : "+ r2; 
  } else {
      alert("Ongeldige invoer. Voer een positief getal in met maximaal 1 decimaal.");
      if (isNaN(invoerWaarde1)) {
        document.getElementById('invSld1').value = 1;
      }
      if (isNaN(invoerWaarde2)) {
        document.getElementById('invSld2').value = 1;
      }
  }
}



// Voeg een event listener toe voor het laden van de pagina
window.addEventListener('DOMContentLoaded', function() {
  // Haal de checkbox-elementen op
  const optie1 = document.getElementById('chbContactspoor');
  const optie2 = document.getElementById('chbOmtrek_a2');

  // Voeg event listeners toe voor het wijzigen van de checkboxen
  optie1.addEventListener('change', function() {
    if (optie1.checked) {
      optie2.checked = false; // Schakel optie 2 uit als optie 1 is ingeschakeld
    }
  });

  optie2.addEventListener('change', function() {
    if (optie2.checked) {
      optie1.checked = false; // Schakel optie 1 uit als optie 2 is ingeschakeld
    }
  });
});