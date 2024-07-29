import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    loadData: (state, action) => {
      state.employees = [...action.payload];
    },
    addEmployee: (state, action) => {
      state.employees = [...state.employees, ...action.payload];
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (item) => item.uniqueId !== action?.payload?.uniqueId
      );
    },
  },
});

export const { addEmployee, removeEmployee, loadData } = employeeSlice.actions;
export default employeeSlice.reducer;
