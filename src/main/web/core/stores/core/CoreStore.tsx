import { Event } from 'typescript.events';
import CoreStoreDispatcher from './CoreStoreDispatcher';
import {ReduceStore} from 'flux/utils';
import {Log, Level} from 'typescript-logger/build/index';
import CoreStoreActions, {Types} from './CoreStoreActions';
class CoreStore extends Event {

    public log = Log.create('CoreStore');

    constructor() {
        super();
    }

    public addChangeListener(callback) {
        this.on('change', callback);
    }

    public removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

    public handleAction(action) {
        switch (action.type) {
            case Types.REBUILD:
            default:
                this.log.info('handleAction', action);
        }
    }

    public register() {
        this.log.info('register', 'ready');
        CoreStoreDispatcher.register(coreStore.handleAction.bind(coreStore));
    }

}

const coreStore = new CoreStore();
export default coreStore;
