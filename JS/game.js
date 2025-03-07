class ChessGame {
    constructor() {
        this.board = document.getElementById('board');
        this.selectedPiece = null;
        this.currentPlayer = 'white';
        this.validMoves = [];
        this.moveHistory = [];
        this.moveListElement = document.getElementById('moveList');
        this.turnIndicator = document.getElementById('turnIndicator');
        this.pieces = {
            'a1': '♜', 'b1': '♞', 'c1': '♝', 'd1': '♛',
            'e1': '♚', 'f1': '♝', 'g1': '♞', 'h1': '♜',
            'a2': '♟', 'b2': '♟', 'c2': '♟', 'd2': '♟',
            'e2': '♟', 'f2': '♟', 'g2': '♟', 'h2': '♟',
            'a7': '♙', 'b7': '♙', 'c7': '♙', 'd7': '♙',
            'e7': '♙', 'f7': '♙', 'g7': '♙', 'h7': '♙',
            'a8': '♖', 'b8': '♘', 'c8': '♗', 'd8': '♕',
            'e8': '♔', 'f8': '♗', 'g8': '♘', 'h8': '♖',
        };
        this.initializeBoard();
        this.updateTurnIndicator();
    }

    initializeBoard() {
        this.board.innerHTML = '';
        for (let row = 8; row >= 1; row--) {
            for (let col = 0; col < 8; col++) {
                const file = String.fromCharCode(97 + col);
                const square = file + row;
                const div = document.createElement('div');
                div.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                div.dataset.position = square;
                
                if (this.pieces[square]) {
                    div.textContent = this.pieces[square];
                    div.classList.add('piece');
                }
                
                div.addEventListener('click', (e) => this.handleSquareClick(e));
                this.addCoordinates(div, file, row);
                this.board.appendChild(div);
            }
        }
    }

    addCoordinates(square, file, row) {
        const fileCoord = document.createElement('div');
        fileCoord.className = 'coordinate file-coordinate';
        fileCoord.textContent = file;
        
        const rankCoord = document.createElement('div');
        rankCoord.className = 'coordinate rank-coordinate';
        rankCoord.textContent = row;
        
        square.appendChild(fileCoord);
        square.appendChild(rankCoord);
    }

    handleSquareClick(event) {
        const square = event.target.closest('.square');
        const position = square.dataset.position;
        const piece = square.textContent;

        if (this.selectedPiece) {
            if (this.validMoves.includes(position)) {
                this.movePiece(this.selectedPiece, square);
                this.selectedPiece = null;
                this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
                this.clearHighlights();
            } else {
                this.clearHighlights();
                this.selectedPiece = null;
            }
        } else if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
            this.selectedPiece = square;
            this.validMoves = this.calculateValidMoves(position, piece);
            this.highlightValidMoves();
        }
    }

    isPieceOwnedByCurrentPlayer(piece) {
        const whitePieces = ['♙', '♖', '♘', '♗', '♕', '♔'];
        const blackPieces = ['♟', '♜', '♞', '♝', '♛', '♚'];
        return this.currentPlayer === 'white' ? 
            whitePieces.includes(piece) : blackPieces.includes(piece);
    }

    calculateValidMoves(position, piece) {
        const moves = [];
        const file = position.charCodeAt(0) - 97;
        const rank = parseInt(position[1]) - 1;

        switch(piece) {
            case '♙': // White pawn
                // Single square move
                const forward1 = String.fromCharCode(97 + file) + (rank + 2);
                if (!this.pieces[forward1]) {
                    moves.push(forward1);
                    // Double square move from starting position
                    if (rank === 1) { // Starting rank (a2)
                        const forward2 = String.fromCharCode(97 + file) + (rank + 3);
                        if (!this.pieces[forward2]) {
                            moves.push(forward2);
                        }
                    }
                }
                break;

            case '♟': // Black pawn
                // Single square move
                const bForward1 = String.fromCharCode(97 + file) + (rank);
                if (!this.pieces[bForward1]) {
                    moves.push(bForward1);
                    // Double square move from starting position
                    if (rank === 6) { // Starting rank (a7)
                        const bForward2 = String.fromCharCode(97 + file) + (rank - 1);
                        if (!this.pieces[bForward2]) {
                            moves.push(bForward2);
                        }
                    }
                }
                break;

            case '♖':
            case '♜': // Rook
                // Horizontal and vertical moves
                for (let i = 0; i < 8; i++) {
                    if (i !== file) moves.push(String.fromCharCode(97 + i) + (rank + 1));
                    if (i !== rank) moves.push(String.fromCharCode(97 + file) + (i + 1));
                }
                break;

            case '♗':
            case '♝': // Bishop
                // Diagonal moves
                for (let i = 1; i < 8; i++) {
                    if (file + i < 8 && rank + i < 8) moves.push(String.fromCharCode(97 + file + i) + (rank + i + 1));
                    if (file - i >= 0 && rank + i < 8) moves.push(String.fromCharCode(97 + file - i) + (rank + i + 1));
                    if (file + i < 8 && rank - i >= 0) moves.push(String.fromCharCode(97 + file + i) + (rank - i + 1));
                    if (file - i >= 0 && rank - i >= 0) moves.push(String.fromCharCode(97 + file - i) + (rank - i + 1));
                }
                break;

            case '♕':
            case '♛': // Queen
                // Combine rook and bishop moves
                // Rook moves
                for (let i = 0; i < 8; i++) {
                    if (i !== file) moves.push(String.fromCharCode(97 + i) + (rank + 1));
                    if (i !== rank) moves.push(String.fromCharCode(97 + file) + (i + 1));
                }
                // Bishop moves
                for (let i = 1; i < 8; i++) {
                    if (file + i < 8 && rank + i < 8) moves.push(String.fromCharCode(97 + file + i) + (rank + i + 1));
                    if (file - i >= 0 && rank + i < 8) moves.push(String.fromCharCode(97 + file - i) + (rank + i + 1));
                    if (file + i < 8 && rank - i >= 0) moves.push(String.fromCharCode(97 + file + i) + (rank - i + 1));
                    if (file - i >= 0 && rank - i >= 0) moves.push(String.fromCharCode(97 + file - i) + (rank - i + 1));
                }
                break;

            case '♔':
            case '♚': // King
                const kingMoves = [
                    [file + 1, rank], [file - 1, rank],
                    [file, rank + 1], [file, rank - 1],
                    [file + 1, rank + 1], [file - 1, rank + 1],
                    [file + 1, rank - 1], [file - 1, rank - 1]
                ];
                kingMoves.forEach(([f, r]) => {
                    if (f >= 0 && f < 8 && r >= 0 && r < 8) {
                        moves.push(String.fromCharCode(97 + f) + (r + 1));
                    }
                });
                break;
        }

        return moves.filter(move => {
            const targetPiece = this.pieces[move];
            return !targetPiece || !this.isPieceOwnedByCurrentPlayer(targetPiece);
        });
    }

    movePiece(from, to) {
        const moveNotation = this.getMoveNotation(from, to);
        this.recordMove(moveNotation);
        this.pieces[to.dataset.position] = from.textContent;
        delete this.pieces[from.dataset.position];
        to.textContent = from.textContent;
        from.textContent = '';
        this.updateTurnIndicator();
    }

    getMoveNotation(from, to) {
        const piece = from.textContent;
        const fromFile = from.dataset.position[0];
        const fromRank = from.dataset.position[1];
        const toPosition = to.dataset.position;
        const capture = this.pieces[toPosition] ? 'x' : '';
        
        // Basic notation (e.g. ♘c3, ♗xf6)
        return `${piece}${capture}${toPosition}`;
    }

    recordMove(notation) {
        this.moveHistory.push(notation);
        const moveNumber = Math.ceil(this.moveHistory.length / 2);
        const isWhiteMove = this.moveHistory.length % 2 !== 0;
        
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        
        if (isWhiteMove) {
            moveItem.textContent = `${moveNumber}. ${notation}`;
        } else {
            const lastItem = this.moveListElement.lastElementChild;
            lastItem.textContent += ` ${notation}`;
            return;
        }
        
        this.moveListElement.appendChild(moveItem);
        this.moveListElement.scrollTop = this.moveListElement.scrollHeight;
    }

    updateTurnIndicator() {
        this.turnIndicator.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + 
                                        this.currentPlayer.slice(1)}'s Turn`;
        this.turnIndicator.style.color = this.currentPlayer === 'white' ? '#fff' : '#000';
        this.turnIndicator.style.background = this.currentPlayer === 'white' ? 
            'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
    }

    highlightValidMoves() {
        document.querySelectorAll('.square').forEach(square => {
            const position = square.dataset.position;
            if (this.validMoves.includes(position)) {
                square.classList.add(this.pieces[position] ? 'valid-capture' : 'valid-move');
            }
        });
        this.selectedPiece.classList.add('selected');
    }

    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('valid-move', 'valid-capture', 'selected');
        });
    }
}

// Start the game
const game = new ChessGame();