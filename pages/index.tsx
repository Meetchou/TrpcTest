import { Button, Input } from "antd";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const { TextArea } = Input;

export default function IndexPage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const utils = trpc.useContext();
	const todoList = trpc.getTodos.useQuery();
	const addMutation = trpc.addTodos.useMutation({
		onSuccess : () => {
			utils.getTodos.invalidate();
		},
	});
	const deleteMutation = trpc.deleteTodo.useMutation({
		onSuccess : () => {
			utils.getTodos.invalidate();
		},
	});

	if (todoList.isLoading) {
		return <>Loading...</>;
	}

	if (todoList.isError) {
		return <>Error</>;
	}

	const TodoListElem = todoList.data.map((elem, idx) => (
		<li key={idx}>{elem.title} - {elem.description} 
			<Button onClick={() => deleteMutation.mutate({id : elem.id})}type="primary" danger>
				Delete
			</Button>
		</li>
	))

	const handleClick = () => {
		if (title !== "" && description !== "")
		{
			addMutation.mutate({title: title, description: description})
		}
	}
  return (
    <div>
		<h1>Todo List</h1>
		<Input.Group compact>
			<Input
				onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
				style={{ width: 'calc(100% - 200px)' }}
				placeholder="new todo title"
				maxLength={10}/>
			<TextArea 
				onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
				rows={4}
				placeholder="Description"
				maxLength={20}/>
			<Button onClick={() => handleClick()} type="primary">Submit</Button>
		</Input.Group>
		<ul>
			{TodoListElem}
		</ul>
    </div>
  );
}
