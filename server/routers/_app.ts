import { z } from "zod";
import { procedure, router } from "../trpc";
import { v4 as uuidv4 } from 'uuid';

interface Todo {
	id: string;
	title: string,
	description: string
};

let todoList: Todo[] = [{
	id: uuidv4(),
	title: 'Boulot',
	description: "Allez a boulot",
},
];

export const appRouter = router({
	getTodos: procedure.query(() => {
		return todoList;
	}),

	addTodos: procedure.input(z.object({
		title: z.string(),
		description: z.string(),
	})).mutation((req) => {
		const todo: Todo = {
			id: uuidv4(),
			title: req.input.title,
			description: req.input.description
		}
		todoList.push(todo);
		return todo;
	}),

	deleteTodo: procedure.input(z.object({
		id: z.string()
	})).mutation((req) => {
		const result = todoList.filter((elem) => (
			elem.id !== req.input.id
		));
		todoList = result
		return result;
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;