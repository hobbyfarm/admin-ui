export type VMTasks = {
  vm_name: string;
  tasks: Task[];
};

export enum ReturnType {
  Return_Text = 'Return Text',
  Return_Code_And_Text = 'Return Code and Text',
  Return_Code = 'Return Code',
  Match_Regex = 'Match Regex',
}

export type Task = {
  name: string;
  description: string;
  command: string;
  expected_output_value: string;
  expected_return_code: number;
  return_type: ReturnType;
};
