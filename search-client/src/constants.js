import React from "react";

export const StateContext = React.createContext();
export const DispatchContext = React.createContext();

export const initialState = {
  searchInput: "",
  filters: ["All"],
};

export const people = [
  { name: "Anuj", role: "Tech Lead", skills: "AI, ML, NLP, DeepLearning" },
  { name: "Raja", role: "Tech Lead", skills: "AI, ML, FullStack" },
  {
    name: "Vishnu",
    role: "SE",
    skills: "AI, ML, Watson",
  },
];

export const communities = [
  {
    name: "AI in Anthem",
    link: "https://anthem.com/blog/ai",
    description: "How we use AI and ML Technologies in Anthem",
  },
  {
    name: "HR in Anthem",
    link: "https://anthem.com/blog/hr",
    description: "How we onboard our new associates with ease",
  },
  {
    name: "Learning at Anthem",
    link: "https://anthem.com/blog/growth",
    description: "How we provide good resources for our associates to grow",
  },
];
