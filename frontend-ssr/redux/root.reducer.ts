import { combineReducers } from 'redux';
import { submissionReducer as submissions } from './exercise-submissions/exercise-submissions.reducer';

const rootReducer = combineReducers({
  submissions,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
