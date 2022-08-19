import EventEmitter from "eventemitter3";

export class EntityState {
	x: number;
	y: number;
}

export interface MoveManager extends EventEmitter {
	addInput(moveX: number, moveY: number): void;
	ackInput(x: number, y: number, lastProcessedInput: number): void;
	update(): void;
}

export const CORRECTION_RATIO = 10;

/**
 * support client-side prediction and server reconciliation
 */
export class PredictedMoveManager extends EventEmitter implements MoveManager {
	private state: EntityState;
	private simulatedState: EntityState;
	private inputSequenceCount = 0;
	private pendingInputs: number[][] = [];

	constructor(initState: EntityState) {
		super();
		this.state = initState;
		this.simulatedState = { ...this.state };
	}

	private applyInput(moveX: number, moveY: number) {
		this.state.x += moveX;
		this.state.y += moveY;
		this.simulatedState.x += moveX;
		this.simulatedState.y += moveY;

		this.emit('newPos', this.state);
	}

	private applyState(state: EntityState) {
		this.state = state;
		this.emit('newPos', this.state);
	}

	addInput(moveX: number, moveY: number) {
		this.applyInput(moveX, moveY);
		const seqId = this.inputSequenceCount;
		this.pendingInputs.push([moveX, moveY, seqId]);
		this.inputSequenceCount += 1;
		return seqId;
	}

	/**
	 * acknowledge the input,
	 * for example, call this method
	 * when received a input ack from server
	 */
	ackInput(x: number, y: number, lastProcessedInput: number) {
		this.simulatedState.x = x;
		this.simulatedState.y = y;

		const newPendingInputs: number[][] = [];
		for (const input of this.pendingInputs) {
			const [moveX, moveY, seqId] = input;
			if (seqId > lastProcessedInput) {
				newPendingInputs.push(input);

				this.simulatedState.x += moveX;
				this.simulatedState.y += moveY;
			}
		}

		this.pendingInputs = newPendingInputs;
	}

	private doBlending() {
		const offsetX = this.state.x - this.simulatedState.x;
		const offsetY = this.state.y - this.simulatedState.y;

		this.state.x += -offsetX / CORRECTION_RATIO;
		this.state.y += -offsetY / CORRECTION_RATIO;

		this.applyState(this.state);
	}

	update() {
		this.doBlending();
    }
}

export class SmoothMoveManager extends EventEmitter implements MoveManager{
	private targetState: EntityState;
	private state: EntityState;
	constructor(initState: EntityState) {
		super();
		this.state = initState;
		this.targetState = { ...this.state };
	}
	private applyState(state: EntityState) {
		this.state = state;
		this.emit('newPos', this.state);
	}
	addInput(x: number, y:number) {

	}
	ackInput(x: number, y: number) {
		this.targetState.x = x;
		this.targetState.y = y;
	}

	private doBlending() {
		const offsetX = this.state.x - this.targetState.x;
		const offsetY = this.state.y - this.targetState.y;

		this.state.x += -offsetX / CORRECTION_RATIO;
		this.state.y += -offsetY / CORRECTION_RATIO;

		this.applyState(this.state);
	}
	update() {
		this.doBlending();
    }
}