import CoreStoreDispatcher from './CoreStoreDispatcher';

class CoreStoreActions {

    public static types = {
        ADD_DOCUMENT : 'ADD_DOCUMENT',
        DELETE_DOCUMENT : 'DELETE_DOCUMENT',
        REBUILD : 'REBUILD',
        SEARCH : 'SEARCH',
    } as any;

    public addDocument(content : string) {
        CoreStoreDispatcher.dispatch({
            data: content,
            type: CoreStoreActions.types.ADD_DOCUMENT,
        });
    }

    public deleteDocument(docId : number) {
        CoreStoreDispatcher.dispatch({
            data: docId,
            type: CoreStoreActions.types.DELETE_DOCUMENT,
        });
    }

    public rebuild() {
        CoreStoreDispatcher.dispatch({
            data: null,
            type: CoreStoreActions.types.REBUILD,
        });
    }

    public search(query : string) {
        CoreStoreDispatcher.dispatch({
            data: query,
            type: CoreStoreActions.types.SEARCH,
        });
    }
}

export const Types = CoreStoreActions.types;
export default new CoreStoreActions();
