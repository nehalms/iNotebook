function TaskCard({task, handleViewDetails}) {
  const completed = task.subtasks.filter(s => s.completed).length;
  const total = task.subtasks.length;
  const progress = Math.round((completed / total) * 100) || 0;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-danger';
      case 'Medium': return 'bg-warning';
      case 'Low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="card m-2 shadow-lg border-0 p-3" style={{ 
      borderRadius: '12px', 
      transition: 'box-shadow 0.3s ease'
    }}>

      <div className="card-body p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0 fw-semibold text-dark">
            {task.title}
          </h5>
          <span className={`badge ${getPriorityColor(task.priority)} rounded-pill px-3 py-2 fs-6`}>
            {task.priority}
          </span>
        </div>

        <div className="mt-4">
          <div className="progress" style={{ height: '12px', borderRadius: '12px', overflow: 'hidden' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ 
                width: `${progress}%`, 
                transition: 'width 0.5s ease',
                backgroundColor: `${
                  progress <= 25 ? 'rgb(255, 0, 0)' : 
                  progress <= 50 ? 'rgb(255, 196, 0)' : 
                  progress <= 75 ? 'rgb(225, 228, 5)' : 
                  'rgb(45, 239, 20)'
                }`
              }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <p className="mt-3 mb-0 text-muted fs-6">
            {completed} of {total} subtasks completed ({progress}%)
          </p>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-primary w-100 w-sm-auto px-4 py-2 fw-semibold"
            style={{
              borderRadius: '8px',
              backgroundColor: '#265bed',
              transition: 'background-color 0.2s ease'
            }}
            onClick={() => {handleViewDetails(task)}}
          >
            View Details <i className="mx-2 fa-solid fa-circle-info"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;