
const boardGame=document.querySelector('.board-game');
let size = 3;
let pickingPicture = `./Assets/image/parrot.webp`;
// const button = document.getElementById("testbtn");
var playingTable;
let gameInProgress=false;
// function timerAnimation() {
//   if (gameInProgress){
//     document.documentElement.style.setProperty('--show-timer-animation', '1');
//   }else{
//     document.documentElement.style.setProperty('--show-timer-animation', '0');
//   }
// }
const previewBtn = document.querySelector('.dropdown-icon');
const startBtn = document.querySelector('.start.btn');
const pauseBtn = document.querySelector('.pause.btn');
const pauseBtnIcon = pauseBtn.querySelector('span')
const restartbtn = document.querySelector('.restart');


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

// function confirm(check){
//   if (check){
//     return true;
//   }else{
//     return false
//   }
// }



// Tắt click trong game option
const optionClick = document.querySelector('.game-option');
optionClick.style.pointerEvents='none';
optionClick.style.filter='blur(10px)';


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
  previewBtn.style.pointerEvents = 'unset';
  previewBtn.style.visibility = 'visible';
}


  btn.addEventListener('click', () => {
    const boardArr = shuffleByMoves(size, 400);
    playingTable=boardArr;
    // alert(playingTable);
    // alert(playingTable.indexOf(8))
    renderAreas(boardArr, size);
  });

function buildGrid(p1){
      if (gameInProgress) {
        const ok = window.confirm('The game is still in progress, are you sure you want to restart?');
        if (!ok) return;               // Nếu Cancel thì dừng
        else {
          gameInProgress = false;
          // timerAnimation();
          startBtn.style.removeProperty('pointer-events');
        }  
      }
        startBtn.style.removeProperty('pointer-events');
        restartbtn.style.visibility='hidden';
        pauseBtn.style.visibility='hidden';

        pauseBtnIcon.style.visibility ='unset';

        
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
  btn.style.pointerEvents = 'none';
  // 
  restartbtn.onclick = () => confirmOngoingGame();
  restartbtn.style.removeProperty('pointer-events');
  // hiện nút pause và restart 
  restartbtn.style.visibility='visible';
  pauseBtn.style.visibility='visible';
  pauseBtnIcon.style.visibility='visible';

  pauseBtn.style.outline='';
  pauseBtn.childNodes[0].nodeValue = '⏸';
  pauseBtnIcon.innerText = 'Pause';
  // // show animation timer
  // document.documentElement.style.setProperty('--show-timer-animation', '1');

  if (checkWin(playingTable, size)) {
        gameInProgress=false;
        stopTimer();
        // ẩn nút restar và pause sau khi win
        restartbtn.style.visibility='hidden';
        pauseBtn.style.visibility='hidden';
        pauseBtnIcon.style.visibility='unset';
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

        previewBtn.style.pointerEvents = 'unset';
        previewBtn.style.visibility = 'hidden';
        pic.style.display = 'none';


        btn.style.removeProperty('pointer-events');
        restartbtn.onclick = null;

        pauseBtn.classList.add('no-pointer');
        startBtn.classList.remove('no-pointer');



        // startBtn.innerHTML='Play Again';
      // Cập nhật thành tích
      // Không cho thao tác với tile nữa
      setTimeout(() => {
        alert('Congratulation!');
      }, 500);  
      

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
    // Nếu click lại chính phần tử đang được chọn, thì dừng luôn
    if (pic.classList.contains('choosing-pic')) return;

    if (gameInProgress) {
      const ok = window.confirm('The game is still in progress, are you sure you want to restart?');
      if (!ok) return;               // Nếu Cancel thì dừng
      else {
        gameInProgress = false;
        // timerAnimation();
      }  
    }
    
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
    // Mơ cho phép nhấn Preview ảnh
    previewBtn.style.pointerEvents = 'unset';
    previewBtn.style.visibility = 'visible';
    
    // Mở click game-option
    optionClick.style.pointerEvents='unset';
    optionClick.style.removeProperty('filter');
  
  }
  
  function choosingLevel(level){

    if (level.classList.contains('choosing-pic')) return;
    // 1) Xóa choosing-level khỏi tất cả thẻ a 
    document.querySelectorAll('.dropdown-content a')
      .forEach(t => t.classList.remove('choosing-level'));
    // 2) Thêm choosing-level vào a
    level.classList.add('choosing-level');
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
      pauseBtn.classList.remove('no-pointer');
      startBtn.classList.add('no-pointer');

      if (timerInterval !== null) return; // nếu đang chạy thì thôi
      timerInterval = setInterval(() => {
        totalSeconds++;
        updateDisplay();
      }, 10);
      document.documentElement.style.setProperty('--show-timer-animation', 'running');

    }

    // Dừng đếm
    function stopTimer() {
      clearInterval(timerInterval);
      timerInterval = null; 
      document.documentElement.style.setProperty('--show-timer-animation', 'paused');
    }

    // Đặt lại về 00:00:00
    function resetTimer() {
      pauseBtn.classList.add('no-pointer');
      startBtn.classList.remove('no-pointer');
      stopTimer();
      totalSeconds = 0;
      updateDisplay();
      document.documentElement.style.setProperty('--show-timer-animation', 'paused');

    }
    function toggleTimer() {
      if (timerInterval) {
        // Đang chạy -> tạm dừng
        stopTimer();
        document.documentElement.style.setProperty('--show-timer-animation', 'paused');
        pauseBtn.childNodes[0].nodeValue = '⏵';
        pauseBtnIcon.style.visibility='visible';
        pauseBtnIcon.innerText='Continue'
        pauseBtn.style.outline='3px solid #ff0000ff'

      } else {
        // Đang dừng -> tiếp tục
        startTimer();
        document.documentElement.style.setProperty('--show-timer-animation', 'running');
        pauseBtn.childNodes[0].nodeValue = '⏸';
        pauseBtnIcon.innerText='Pause'
        pauseBtn.style.outline=''

      }
    }
      
    function confirmOngoingGame() {
      // Thông báo kèm hai lựa chọn OK/Cancel
      // if(!gameInProgress){
      //   startGame();
      //   resetTimer();
      //   return;
      // } 

      if(!gameInProgress){
        return;
      } 
      const proceed = window.confirm('The game is still in progress, are you sure you want to restart?');
      if (proceed) {
        restartbtn.style.visibility='hidden';
        pauseBtn.style.visibility='hidden';
        pauseBtnIcon.style.visibility='hidden';
        // Người dùng chọn OK → làm tiếp hành động (ví dụ restart)
        gameInProgress=false;


        startGame();
        resetTimer();
        
        document.documentElement.style.setProperty('--show-timer-animation', 'paused');


        // timerAnimation();

      } else {
        // Người dùng chọn Cancel → hủy hành động
        // Có thể log hoặc không làm gì thêm
        console.log('Người dùng đã hủy thao tác.');
      }
    }
  
const pic = document.querySelector('.dropdown-picture img');
const moveOptionBoard = document.querySelector('.game-option');

    // Preview Picture
    function showPreview() {
      pic.src=pickingPicture;
      // Toggle its visibility
      if (pic.style.display === 'block') {
        pic.style.display = 'none';
      } else {
        pic.style.display = 'block';
      }
    }

    const playGround = document.querySelector('.playground');
    const startText = document.querySelector('.start');
    function showPreview600px() {
      pic.src=pickingPicture;

      // Toggle its visibility
      if (pic.style.display === 'block') {
        playGround.style.minWidth='55vh';
        playGround.style.minHeight='55vh';
        startText.style.fontSize='1.5rem';

        moveOptionBoard.classList.remove('game-option-move-below600px');
        pic.style.display = 'none';
      } else {
        playGround.style.minWidth='53vh';
        playGround.style.minHeight='53vh';
        startText.style.fontSize='1rem';

        moveOptionBoard.classList.add('game-option-move-below600px');
        pic.style.display = 'block';
      }
    }

    // Setting //
    const settings   = document.querySelector('.settings');
    const settingBtn = settings.querySelector('.settings-button');
    const rightHeadPage  = document.querySelector('.right-head-page');
    const dropdown      = settings.querySelector('.dropdown');


    // 1) Toggle open/close khi click lên toàn vùng right-head-page
    settingBtn.addEventListener('click', e => {
      e.stopPropagation();        // ngăn nổi bọt để document click không đóng ngay
      settings.classList.toggle('open');
      rightHeadPage.classList.toggle('open-setting');
    });


    // 2) Click ra ngoài sẽ đóng dropdown
    document.addEventListener('click', () => {
      settings.classList.remove('open');
      rightHeadPage.classList.remove('open-setting');
    });

    // 3) Ngăn đóng khi click vào chính dropdown
    rightHeadPage.addEventListener('click', e => {
      e.stopPropagation();
    });  
      
// Responsive
    // 1. Định nghĩa media query giống CSS
    const mq = window.matchMedia('(max-width: 768px)');
    // 2. Hàm update nội dung
    function updateContent(e) {
      const restartText = document.querySelector('.restart');
      const hideTime = document.querySelector('.timer > div > #name-Time');
      if (e.matches) {
        // Khi màn ≤ 600px (mobile)
        restartText.textContent = '⟳';
        pauseBtnIcon.style.display = 'none';
        hideTime.style.display='none';
        pic.style.display = 'none';
        playGround.style.minWidth='55vh';
        playGround.style.minHeight='55vh';

        moveOptionBoard.classList.remove('game-option-move-below600px');
        document.querySelector('[onclick="showPreview()"]').setAttribute('onclick', 'showPreview600px()');
        // if (pic.style.display === 'block') {
        //   moveOptionBoard.classList.remove('game-option-move-below600px');
        // } else {
        //   moveOptionBoard.classList.add('game-option-move-below600px');
        //   pic.style.display = 'block';
        // }

      } else {
        // Khi màn > 600px (tablet/desktop)
        pic.style.display = 'none';
        startText.style.fontSize='1.5rem';
        moveOptionBoard.classList.remove('game-option-move-below600px');
        playGround.style.left='unset';
        restartText.textContent = '⟳Restart';
        pauseBtnIcon.style.display = 'unset';
        hideTime.style.display='';
        document.querySelector('[onclick="showPreview600px()"]').setAttribute('onclick', 'showPreview()');

      }
    }

    // 3. Kiểm tra lần đầu và lắng nghe thay đổi
    mq.addEventListener('change', updateContent);
    updateContent(mq);
















