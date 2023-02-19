import { api } from "../utils/api";
import { useState } from "react";
import { todoInput } from "../types";
import { toast } from "react-hot-toast";

const CreateTodo = () => {
  const [newTodo, setNewTodo] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.todo.create.useMutation({
    onMutate: async (newTodo) => {
      // cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todo.all.cancel();

      const previousTodos = trpc.todo.all.getData();

      // optimistically update to the new value
      trpc.todo.all.setData(undefined, (prev) => {
        const optimisticTodo = {
          id: "optimistic-todo-id",
          text: newTodo,
          done: false,
        };
        if (!prev) return [optimisticTodo];
        return [...prev, optimisticTodo];
      });

      setNewTodo("");

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      toast.error("An error occured when creating new todo.");
      setNewTodo(newTodo);
      trpc.todo.all.setData(undefined, (prev) => context?.previousTodos);
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const result = todoInput.safeParse(newTodo);

          if (!result.success) {
            console.log("input not valid");
            toast.error(result.error.format()._errors.join("\n"));
            return;
          }

          // create todo mutation
          mutate(newTodo);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Enter new todo..."
          name="new-todo"
          id="new-todo"
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTodo;
