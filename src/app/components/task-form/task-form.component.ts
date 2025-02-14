import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
    taskForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private router: Router
    ) {
        this.taskForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            completed: [false]
        });
    }

    ngOnInit(): void {}

    onSubmit(): void {
     if (this.taskForm.valid) {
    
        const taskData = {
            ...this.taskForm.value,
    
          };
            this.taskService.addTask(taskData).subscribe(() => {
                this.router.navigate(['/tasks']);
            });
        }
    }
}
