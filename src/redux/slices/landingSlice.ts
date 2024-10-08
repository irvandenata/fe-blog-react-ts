import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const landingSlice = createSlice({
    name: "landing",
    initialState: {
        header: {
            is_load: false,
            data: {},
        },
        techStack: {
            is_load: false,
            frontend: [],
            backend: [],
            others: [],
        },
        workExperience: {
            is_load: false,
            data: [],
        },
        projects: {
            is_load: false,
            data: [],
        },
        socialMedia: {
            is_load: false,
            data: [],
        },
        activeMenu:""
    },
    reducers: {
        setHeader: (state, action: PayloadAction<any>) => {
            state.header.data = action.payload;
            state.header.is_load = true;
        },
        setTechStack: (state, action: PayloadAction<any>) => {
            state.techStack.frontend = action.payload.frontend;
            state.techStack.backend = action.payload.backend;
            state.techStack.others = action.payload.others;
            state.techStack.is_load = true;
        },
        setWorkExperience: (state, action: PayloadAction<any>) => {
            state.workExperience.data = action.payload.data;
            state.workExperience.is_load = true;
        },
        setProjects: (state, action: PayloadAction<any>) => {
            state.projects.data = action.payload.data;
            state.projects.is_load = true;
        },
        setSocialMedia: (state, action: PayloadAction<any>) => {
            state.socialMedia.data = action.payload.data;
            state.socialMedia.is_load = true;
        }, 
        setActiveMenu: (state, action: PayloadAction<string>) => {
            state.activeMenu = action.payload;
        }
    },
});

export const { setHeader, setTechStack, setWorkExperience , setProjects,setSocialMedia , setActiveMenu} =
    landingSlice.actions;
export default landingSlice.reducer;
