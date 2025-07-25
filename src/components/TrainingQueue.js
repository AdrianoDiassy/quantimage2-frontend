import React from 'react';
import { Button, Table, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TrainingQueue = ({ 
  collections, 
  onTrainModel, 
  isTraining, 
  trainingProgress,
  models = [],
  featureExtractionID,
  selectedLabelCategory,
  onNavigateToModels
}) => {
  if (!collections || collections.length === 0) {
    return (
      <div className="text-center p-4">
        <p>No collections available for training.</p>
      </div>
    );
  }

  

  // Since models passed to Train component are already filtered by Features.js 
  // for the current feature extraction and collection, we just need to check if any exist
  const hasTrainedModels = models && models.length > 0;


  if (hasTrainedModels) {
    return (
      <div className="container-fluid px-0">
        <div className="row justify-content-center">
          <div className="col-12">
            <Alert color="info" className="mt-4 d-flex justify-content-between align-items-center">
              <div>
                <FontAwesomeIcon icon="info-circle" className="me-2" />
                 This model is trained. View details in the "Model Evaluation" tab.
              </div>
              <div className="d-flex">
  {onNavigateToModels && (
    <Button
      color="primary"
      size="sm"
      onClick={onNavigateToModels}
      className="mr-3"
    >
      Go to Model Evaluation
    </Button>
  )}
  <Button
    color="primary"
    size="sm"
    onClick={() => onTrainModel(collections[0])}
    disabled={isTraining}
  >
    {isTraining ? 'Retraining...' : 'Train Again'}
  </Button>
</div>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>Collection</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {collections.map((collection, index) => (
          <tr key={collection.id || index}>
            <td>{collection.name || `Collection ${index + 1}`}</td>
            <td>
              <span className="badge badge-secondary">
                Ready for Training
              </span>
            </td>
            <td>
              <Button
                color="primary"
                size="sm"
                onClick={() => onTrainModel(collection)}
                disabled={isTraining}
              >
                {isTraining ? (
                  <>
                    <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                    Training...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon="play" className="mr-2" />
                    Train Model
                  </>
                )}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TrainingQueue;
