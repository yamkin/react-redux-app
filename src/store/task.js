import { createAction, createSlice } from '@reduxjs/toolkit';
import todosService from '../services/todos.service';
import { setError } from './errors';
const initialState = { entities: [], isLoading: true };

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    recived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    taskAdded(state, action) {
      state.entities.push(action.payload);
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex((el) => el.id === action.payload.id);
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter((el) => el.id !== action.payload.id);
    },
    loadTaskRequested(state) {
      state.isLoading = true;
    },
    taskRequestFailed(state) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, recived, taskRequestFailed, taskAdded, loadTaskRequested } = actions;

const taskRequested = createAction('task/taskRequested');

export const loadTasks = () => async (dispatch) => {
  dispatch(loadTaskRequested());
  try {
    const data = await todosService.fetch();
    dispatch(recived(data));
  } catch (error) {
    dispatch(taskRequestFailed());
    dispatch(setError(error.message));
  }
};

export const createTask = (task) => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.post(task);
    dispatch(taskAdded(data));
  } catch (error) {
    dispatch(taskRequestFailed());
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch) => {
  dispatch(update({ id, completed: true }));
};

export const titleChanged = (id) => (dispatch) => {
  dispatch(update({ id, title: `New title for ${id}` }));
};

export const taskDeleted = (id) => (dispatch) => {
  dispatch(remove({ id }));
};

export const getTasks = () => (state) => {
  return state.tasks.entities;
};
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;
