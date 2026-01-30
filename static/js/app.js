// dashboard.js - Funcionalidad para el dashboard
(function() {
    'use strict';
    
    // Obtener datos desde HTML
    const appData = document.getElementById('app-data');
    if (!appData) return;
    
    const tasksData = JSON.parse(appData.dataset.tasks || '[]');
    const projectsData = JSON.parse(appData.dataset.projects || '[]');
    const usersData = JSON.parse(appData.dataset.users || '[]');
    const taskUpdateUrl = appData.dataset.taskUpdateUrl || '';
    const taskAddUrl = appData.dataset.taskAddUrl || '';
    const projectUpdateUrl = appData.dataset.projectUpdateUrl || '';
    const projectAddUrl = appData.dataset.projectAddUrl || '';
    
    // Sistema de tabs
    function initTabs() {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                const tabElement = document.getElementById(tabName + 'Tab');
                if (tabElement) {
                    tabElement.classList.add('active');
                }
                this.classList.add('active');
            });
        });
    }
    
    // Funciones para tareas
    function selectTask(id) {
        // Convertir id a número si es posible
        const taskId = isNaN(id) ? id : Number(id);
        const task = tasksData.find(t => t.id == taskId);
        
        if (!task) {
            console.warn('Tarea no encontrada con ID:', id);
            return;
        }
        
        // Rellenar formulario
        document.getElementById('taskTitle').value = task.title || '';
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskStatus').value = task.status || 'Pendiente';
        document.getElementById('taskPriority').value = task.priority || 'Media';
        document.getElementById('taskProject').value = task.projectId || '';
        document.getElementById('taskAssigned').value = task.assignedTo || '';
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskHours').value = task.estimatedHours || '';
        
        // Actualizar formulario
        const form = document.getElementById('taskForm');
        if (form && taskUpdateUrl) {
            form.action = taskUpdateUrl.replace('/0', '/' + taskId);
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Actualizar';
            }
        }
    }
    
    function clearTaskForm() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskStatus').value = 'Pendiente';
        document.getElementById('taskPriority').value = 'Media';
        document.getElementById('taskProject').selectedIndex = 0;
        document.getElementById('taskAssigned').selectedIndex = 0;
        document.getElementById('taskDueDate').value = '';
        document.getElementById('taskHours').value = '';
        
        const form = document.getElementById('taskForm');
        if (form && taskAddUrl) {
            form.action = taskAddUrl;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Agregar';
            }
        }
    }
    
    // Funciones para proyectos
    function selectProject(id) {
        const projectId = isNaN(id) ? id : Number(id);
        const project = projectsData.find(p => p.id == projectId);
        
        if (!project) {
            console.warn('Proyecto no encontrado con ID:', id);
            return;
        }
        
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectName').value = project.name || '';
        document.getElementById('projectDescription').value = project.description || '';
        document.getElementById('projectUpdateBtn').style.display = 'inline';
    }
    
    function submitProjectAdd() {
        const form = document.getElementById('projectForm');
        if (form && projectAddUrl) {
            form.action = projectAddUrl;
            form.method = 'post';
            form.submit();
        }
    }
    
    function submitProjectUpdate() {
        const id = document.getElementById('projectId').value;
        if (!id) return;
        
        const form = document.getElementById('projectForm');
        if (form && projectUpdateUrl) {
            form.action = projectUpdateUrl.replace('/0', '/' + id);
            form.method = 'post';
            form.submit();
        }
    }
    
    // Confirmación para formularios de eliminar
    function initDeleteForms() {
        document.querySelectorAll('.delete-form').forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!confirm('¿Estás seguro de eliminar este elemento?')) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Inicializar eventos
    function initEvents() {
        // Botones de editar tareas
        document.querySelectorAll('.btn-edit-task').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = this.getAttribute('data-task-id');
                if (taskId) {
                    selectTask(taskId);
                }
            });
        });
        
        // Botones de editar proyectos
        document.querySelectorAll('.btn-edit-project').forEach(btn => {
            btn.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');
                if (projectId) {
                    selectProject(projectId);
                }
            });
        });
        
        // Botón limpiar formulario tarea
        const clearBtn = document.getElementById('clearTaskBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearTaskForm);
        }
        
        // Botones de proyectos
        const projectAddBtn = document.getElementById('projectAddBtn');
        if (projectAddBtn) {
            projectAddBtn.addEventListener('click', submitProjectAdd);
        }
        
        const projectUpdateBtn = document.getElementById('projectUpdateBtn');
        if (projectUpdateBtn) {
            projectUpdateBtn.addEventListener('click', submitProjectUpdate);
        }
    }
    
    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        initTabs();
        initEvents();
        initDeleteForms();
        
        // Activar primera tab si no hay una activa
        if (!document.querySelector('.tab-button.active')) {
            const firstTab = document.querySelector('.tab-button');
            if (firstTab) firstTab.click();
        }
        
        console.log('Dashboard JavaScript cargado correctamente');
    });
    
    // Hacer funciones disponibles globalmente si es necesario
    window.selectTask = selectTask;
    window.clearTaskForm = clearTaskForm;
    window.selectProject = selectProject;
    window.submitProjectAdd = submitProjectAdd;
    window.submitProjectUpdate = submitProjectUpdate;
})();