
const boardGame=document.querySelector('.board-game');
let size = 3;
let pickingPicture = `./assets/image/parrot.webp`;
// const button = document.getElementById("testbtn");
var playingTable;
let gameInProgress=false;

// button.addEventListener("click", myFunction);
// function myFunction() {
//   let x = playingTable.indexOf((size*size)-1);
//   document.getElementById("test").innerHTML = playingTable;
// }

    function toggleTileNumber() {
      // Lấy NodeList các phần tử .tile-number
      const elements = document.querySelectorAll('.tile-number');
      elements.forEach(el => {
        // Nếu style.visibility chưa được gán, sẽ trả về ''
        const current = el.style.visibility || 'visible';
        el.style.visibility = (current === 'hidden') ? 'visible' : 'hidden';
      });
    }



const btn= document.getElementById('merge');

function startGame(){
  // const btn = document.querySelector('.start.btn');
  // Nếu timerInterval đang chạy (game vẫn diễn ra)
  // if (totalSeconds) {
  //   const ok = window.confirm('Trò chơi vẫn đang diễn ra, bạn có chắc muốn bắt đầu lại?');
  //   if (!ok) return;               // Nếu Cancel thì dừng
  //   // Nếu OK, tạm thời vô hiệu nút để tránh click liên tục
  //   btn.style.pointerEvents = 'none';
  // }
  // 1) Shuffle và render grid
  buildGrid(size);
  const boardArr = shuffleByMoves(size, 500);
  playingTable = boardArr;
  renderAreas(boardArr, size);

  // btn.style.removeProperty('pointer-events');

  // 2) Bỏ lớp 'stop-move' khỏi mọi tile
  document.querySelectorAll('.tile').forEach(tile => {
    tile.classList.remove('stop-move');
  });
  // 

}


  btn.addEventListener('click', () => {
    const boardArr = shuffleByMoves(size, 400);
    playingTable=boardArr;
    // alert(playingTable);
    // alert(playingTable.indexOf(8))
    renderAreas(boardArr, size);
  });

function buildGrid(p1){
      size=p1;
      boardGame.innerHTML = '';
      resetStep();

      // boardGame.style.gridTemplateRows = `repeat(${p1}, 1fr)`;
      // boardGame.style.gridTemplateColumns = `repeat(${p1}, 1fr)`;
      // boardGame.style.gridTemplateAreas = ''; 
      boardGame.style.setProperty('--level', p1);

       // Tạo n div.tile với id tile1,tile2,...tilen
      for (let i = 1; i <= p1*p1; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile'+ ' stop-move'+(i===size*size ? ' blank' : '');
        tile.id = `tile${i}`;   
        tile.onclick = () => moveTile(i-1);
        tile.style.gridArea = `tile${i}`;
        // đánh số mỗi tile
        const label = document.createElement('span');
        label.className = 'tile-number';
        label.textContent = i;
        label.style.visibility='hidden';
        tile.appendChild(label);
        // Tạo thẻ img và gán src, alt
        const img = document.createElement('img');
        img.src = pickingPicture;    
        // Bỏ img vào div.tile
        tile.appendChild(img);
        // Bỏ div.tile vào board-game
        boardGame.appendChild(tile);
      }      
      
      // for (let i = 1; i <= p1*p1; i++) {
      // const tileGrid = document.getElementById(`tile${i+1}`);
      // tileGrid.style.gridArea=`tile${i+1}`;
      // }
      // boardGame.style.gridTemplateRows = `repeat(${p1}, 1fr)`;
      // boardGame.style.gridTemplateColumns = `repeat(${p1}, 1fr)`;
      setPositon(p1);
      // const boardArr = shuffleByMoves(size, 400);
      // playingTable=boardArr;
      playingTable=makeSolved(p1);
      // alert(playingTable);
      // alert(playingTable.indexOf(8))
      renderAreas(playingTable, size);
      resetTimer();
    };
function setPositon(p1){
    for(let i=0; i< p1 ; i++){
        for(let j=0; j <p1 ; j++){
        let idx= i * p1 + j + 1 ;
        const img = document.querySelector(`#tile${idx} img`);
        img.style.left     = `${-j * 100}%`;
        img.style.top      = `${-i * 100}%`;
        // if(idx==(p1*p1)){
        //     img.style.visibility ='hidden';
        // }
    }
}
}


// const merge = document.getElementById("merge")
// merge.addEventListener("click", function(){mergeTile(currentLevel)});
// function mergeTile(p1){
//     maxTop = (currentLevel-1)*100%;
//     maxLeft = (currentLevel-1)*100%;
// }
  const toRC = idx => [Math.floor(idx/size), idx%size];
  const toIdx = (r,c) => r*size+c;
  // Tạo mảng 0..8
  function makeSolved(size) {
    return Array.from({length: size*size}, (_,i) => i);
  }
  // Shuffle bằng các bước di chuyển hợp lệ (ví dụ đơn giản)
  function shuffleByMoves(size, moves=300) {
    const board = makeSolved(size);
    resetStep();
    let blank = board.length -1;
    const dirs = [
        { dr: -1, dc: 0 }, // lên
        { dr: 1,  dc: 0 }, // xuống
        { dr: 0,  dc: -1}, // trái
        { dr: 0,  dc: 1 }  // phải
      ];
    
    for (let k=0;k<moves;k++) {
      const [r,c] = toRC(blank);
    // Thu thập các láng giềng
      const neigh = dirs
        .map(d=>[r+d.dr,c+d.dc])
        .filter(([rr,cc])=> rr>=0&&rr<size&&cc>=0&&cc<size)
        .map(([rr,cc])=>toIdx(rr,cc));
    // Chọn ngẫu nhiên 1 láng giềng và swap
      const pick = neigh[Math.floor(Math.random()*neigh.length)];
      
      [board[blank], board[pick]] = [board[pick], board[blank]];
      blank = pick;
    }
    return board;
  }


  function renderAreas(board, size) {
    const areas = [];
    for (let i = 0; i < size*size; i += size) {
      // const tile = document.getElementById(`tile${i+1}`);
      // tile.style.gridArea=`tile${i+1}`;
      // lấy slice mỗi hàng, đổi thành chuỗi "tileX tileY tileZ"
      const row = board.slice(i, i+size)
                       .map(v => `tile${v+1}`)
                       .join(' ');
      areas.push(`"${row}"`);
    }
    // alert(areas);
    // gán vào style
    boardGame.style.gridTemplateAreas = areas.join('\n');
  }

// const clickTile = document.getElementById("")

//Kiểm tra ô clicked (idx1) có kề blank (idx2) không
function isAdjacent(idx1, idx2) {
  // const { r: r1, c: c1 } = toRC(idx1);
  // const { r: r2, c: c2 } = toRC(idx2);
  const a=toRC(idx1);
  const b=toRC(idx2);

  // cùng hàng và cách 1 cột, hoặc cùng cột và cách 1 hàng
  return (a[0] === b[0] && Math.abs(a[1] - b[1]) === 1)
      || (a[1] === b[1] && Math.abs(a[0] - b[0]) === 1);

}

function moveTile(tileValue) {
  gameInProgress=true;
  // 1) Tìm index clicked và blank trong mảng
  const idxClick = playingTable.indexOf(tileValue);
  const idxBlank = playingTable.indexOf((size * size)-1);
  // 2) Kiểm tra adjacency
  if (!isAdjacent(idxClick, idxBlank)){
    // alert("ko kề nhau");
    return;  // không di chuyển
  }
  
  // 3) Hoán đổi trong mảng
  [ playingTable[idxClick], playingTable[idxBlank] ] =
    [ playingTable[idxBlank], playingTable[idxClick] ];

  // 4) Render lại layout
  renderAreas(playingTable, size);
  // alert(playingTable);
  countStep();
  startTimer();
  const btn = document.querySelector('.start.btn');
  btn.style.pointerEvents = 'none';

  const restartbtn = document.querySelector('.restart');
  restartbtn.onclick = () => confirmOngoingGame();
  restartbtn.style.removeProperty('pointer-events');

  if (checkWin(playingTable, size)) {
      setTimeout(() => {
        alert('Chúc mừng bạn đã hoàn thành!');
        // Bạn có thể thêm logic reset hoặc hiển thị kết quả ở đây
        document.querySelectorAll('.tile').forEach(tile => {
        tile.classList.add('stop-move');
        tile.style.border = 'none';
        // tile.classList.remove('blank');
        });
        document.querySelectorAll('.tile-number').forEach(tileNum => {
        tileNum.style.visibility = 'hidden';
        // tile.classList.remove('blank');
        });
        let blank = document.querySelector('.tile.blank');
        blank.classList.remove('blank');

        btn.style.removeProperty('pointer-events');
        restartbtn.onclick = null;
        restartbtn.style.pointerEvents='none';
        gameInProgress=false;
        
        stopTimer();
      }, 100);
      // Cập nhật thành tích
      // Không cho thao tác với tile nữa

    }
}

function checkWin(table, size) {
  // 1) Chuẩn bị mảng mục tiêu: [1,2,…,size*size]
  const target = Array.from({ length: size*size }, (_, i) => i);
// alert(target);
  // 2) So sánh hai mảng
  return table.length === target.length
      && table.every((v, i) => v === target[i]);
}
// function moveTile(){

// }

  function choosingPic(pic) {
    if (gameInProgress) {
      const ok = window.confirm('Trò chơi vẫn đang diễn ra, bạn có chắc muốn bắt đầu lại?');
      if (!ok) return;               // Nếu Cancel thì dừng
    }
    // Nếu click lại chính phần tử đang được chọn, thì dừng luôn
    if (pic.classList.contains('choosing-pic')) return;
    // 1) Xóa choosing-pic khỏi tất cả thẻ div có class gallery-pic
    document.querySelectorAll('div.gallery-pic')
      .forEach(t => t.classList.remove('choosing-pic'));
    // tắt thông báo "choose picture in gallery"
    document.querySelector('div.choose-pic-notify').style.display='none';
    // 2) Thêm choosing-pic vào pic
    pic.classList.add('choosing-pic');
    // 3) Lấy src của <img> con và cập nhật biến pickingPicture
    const img = pic.querySelector('img');
    if (img) {
      pickingPicture = img.src;
      console.log('Đã chọn ảnh:', pickingPicture);
    }
    // cập nhật ảnh trong preview
    const previewPic = document.querySelector('.dropdown-picture img');
    previewPic.src=pickingPicture;
    // 4) Tạo lại board game với img mới
    buildGrid(size);
    resetTimer();

      // shuffleByMoves(size);
  }


  // Hàm đếm lần di chuyển 
    function countStep() {
      // Tăng biến đếm
      stepCount++;
      // Cập nhật nội dung div
      const el = document.querySelector('.steps');
      el.textContent = `Steps: ${stepCount}`;
    }
    function resetStep(){
    stepCount = 0;
    const el = document.querySelector('.steps');
    el.textContent = `Steps: ${stepCount}`;
    }


    // Các hàm đếm giờ
    let timerInterval = null;
    let totalSeconds = 0;
    // Định dạng số thành hai chữ số, ví dụ 4 -> "04"
    function pad(value) {
      return value.toString().padStart(2, '0');
    }
      // Cập nhật hiển thị
    function updateDisplay() {
      const minutes   = Math.floor(totalSeconds / 3600);
      const seconds = Math.floor((totalSeconds % 3600) / 60);
      const miliseconds = totalSeconds % 60;
      const str = `${pad(minutes)}:${pad(seconds)}:${pad(miliseconds)}`;
      document.getElementById('timer').textContent = str;
    }

    // Bắt đầu đếm
    function startTimer() {
      if (timerInterval !== null) return; // nếu đang chạy thì thôi
      timerInterval = setInterval(() => {
        totalSeconds++;
        updateDisplay();
      }, 10);
    }

    // Dừng đếm
    function stopTimer() {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    // Đặt lại về 00:00:00
    function resetTimer() {
      stopTimer();
      totalSeconds = 0;
      updateDisplay();
    }
    function toggleTimer() {
      if (timerInterval) {
        // Đang chạy -> tạm dừng
        stopTimer();
      } else {
        // Đang dừng -> tiếp tục
        startTimer();
      }
    }
      
    function confirmOngoingGame() {
      // Thông báo kèm hai lựa chọn OK/Cancel
      if(!gameInProgress){
        startGame();
        resetTimer();
        return;
      } 
      const proceed = window.confirm('Trò chơi vẫn đang diễn ra, bạn chắc chắn muốn tiếp tục?');
      if (proceed) {
        // Người dùng chọn OK → làm tiếp hành động (ví dụ restart)
        startGame();
        resetTimer();
        gameInProgress=false;
      } else {
        // Người dùng chọn Cancel → hủy hành động
        // Có thể log hoặc không làm gì thêm
        console.log('Người dùng đã hủy thao tác.');
      }
    }

    // Preview Picture
    function showPreview() {
      const pic = document.querySelector('.dropdown-picture img');
      pic.src=pickingPicture;
      // Toggle its visibility
      if (pic.style.display === 'block') {
        pic.style.display = 'none';
      } else {
        pic.style.display = 'block';
      }
    }



    // Setting //
    const settings = document.querySelector('.settings');
    const settingBtn      = settings.querySelector('.settings-button');

    // Toggle open/close khi click nút
    settingBtn.addEventListener('click', e => {
      e.stopPropagation();             // ngăn sự kiện nổi bọt
      settings.classList.toggle('open');
    });

    // Click ra ngoài sẽ đóng dropdown
    document.addEventListener('click', () => {
      settings.classList.remove('open');
    });

    // Ngăn đóng khi click vào menu
    settings.querySelector('.settings-dropdown')
            .addEventListener('click', e => e.stopPropagation());

    


    


















