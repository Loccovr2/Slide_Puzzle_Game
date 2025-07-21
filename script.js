
const boardGame=document.querySelector('.board-game')
let size;

function buildGrid(p1){
      size=p1;
      boardGame.innerHTML = '';
      boardGame.style.removeProperty('grid-template-areas');
      // Tạo n div.tile với id tile1,tile2,...tilen
      for (let i = 1; i <= p1*p1; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile${i}`;
        // tile.style.gridArea = `tile${i}`;
        // đánh số mỗi tile
        const label = document.createElement('span');
        label.className = 'tile-number';
        label.textContent = i;
        tile.appendChild(label);
        // Tạo thẻ img và gán src, alt
        const img = document.createElement('img');
        img.src = `sample_pic.jpg`;    
        // Bỏ img vào div.tile
        tile.appendChild(img);
        // Bỏ div.tile vào board-game
        boardGame.appendChild(tile);
      }
      boardGame.style.setProperty('--level', p1);

      setPositon(p1);
    };
function setPositon(p1){
    for(let i=0; i< p1 ; i++){
        for(let j=0; j <p1 ; j++){
        let idx= i * p1 + j + 1 ;
        const img = document.querySelector(`#tile${idx} img`);
        img.style.left     = `${-j * 100}%`;
        img.style.top      = `${-i * 100}%`;
        if(idx==(p1*p1)){
            img.style.visibility ='hidden';
        }
    }
}
}


// const merge = document.getElementById("merge")
// merge.addEventListener("click", function(){mergeTile(currentLevel)});
// function mergeTile(p1){
//     maxTop = (currentLevel-1)*100%;
//     maxLeft = (currentLevel-1)*100%;
// }

  // Tạo mảng 0..8
  function makeSolved(size) {
    return Array.from({length: size*size}, (_,i) => i);
  }
  // Shuffle bằng các bước di chuyển hợp lệ (ví dụ đơn giản)
  function shuffleByMoves(size, moves=200) {
    const board = makeSolved(size);
    let blank = board.length -1;
    const dirs = [{dr:-1,dc:0},{dr:1,dc:0},{dr:0,dc:-1},{dr:0,dc:1}];
    const toRC = idx => [Math.floor(idx/size), idx%size];
    const toIdx = (r,c) => r*size+c;
    for (let k=0;k<moves;k++) {
      const [r,c] = toRC(blank);
      const neigh = dirs
        .map(d=>[r+d.dr,c+d.dc])
        .filter(([rr,cc])=> rr>=0&&rr<size&&cc>=0&&cc<size)
        .map(([rr,cc])=>toIdx(rr,cc));
      const pick = neigh[Math.floor(Math.random()*neigh.length)];
      [board[blank], board[pick]] = [board[pick], board[blank]];
      blank = pick;
    }
    return board;
  }


  function renderAreas(board, size) {
    const areas = [];
    for (let i = 0; i < size*size; i += size) {
      const tile = document.getElementById(`tile${i+1}`);
      tile.style.gridArea=`tile${i+1}`;
      // lấy slice mỗi hàng, đổi thành chuỗi "tileX tileY tileZ"
      const row = board.slice(i, i+size)
                       .map(v => `tile${v+1}`)
                       .join(' ');
      areas.push(`"${row}"`);
    }
    // gán vào style
    boardGame.style.gridTemplateAreas = areas.join('\n');
  }

const button = document.getElementById("testbtn");

button.addEventListener("click", myFunction);
function myFunction() {
  const justtest=shuffleByMoves(size,100);
  document.getElementById("test").innerHTML = justtest;

}

  const btn= document.getElementById('merge');
  btn.addEventListener('click', () => {
    const boardArr = shuffleByMoves(size, 400);
    renderAreas(boardArr, size);
  });