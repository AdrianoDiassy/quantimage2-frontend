import { pythonBackendBaseURL } from './config';

import { downloadFile, rawRequest, request } from './common';
import { parseFeatureDetailsResponse } from '../utils/multipart-parser';
import {
  DATA_SPLITTING_TYPES,
  TRAIN_TEST_SPLIT_TYPES,
} from '../config/constants';

const baseEndpoint = `${pythonBackendBaseURL}`;

const endpoints = {
  analyze: `${baseEndpoint}/analyze`,
  extract: `${baseEndpoint}/extract`,
  extractions: `${baseEndpoint}/extractions`,
  collections: `${baseEndpoint}/feature-collections`,
  presets: `${baseEndpoint}/feature-presets`,
  models: `${baseEndpoint}/models`,
  labelCategories: `${baseEndpoint}/label-categories`,
  labels: `${baseEndpoint}/labels`,
  tasks: `${baseEndpoint}/tasks`,
  charts: `${baseEndpoint}/charts`,
  navigation: `${baseEndpoint}/navigation`,
  albums: `${baseEndpoint}/albums`,
  clinicalFeatures: `${baseEndpoint}/clinical-features`,
  clinicalFeaturesDefinitions: `${baseEndpoint}/clinical-features-definitions`,
};

class Backend {
  async extractions(token, albumID) {
    try {
      const url = albumID
        ? `${endpoints.extractions}/album/${albumID}`
        : endpoints.extractions;
      return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async extraction(token, extractionID) {
    try {
      const url = `${endpoints.extractions}/${extractionID}`;
      return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async updateExtraction(token, extractionID, fields) {
    try {
      const url = `${endpoints.extractions}/${extractionID}`;

      return await request(url, {
        method: 'PATCH',
        data: fields,
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async extractionFeatureDetails(token, extractionID) {
    try {
      const url = `${endpoints.extractions}/${extractionID}/feature-details`;

      let response = await rawRequest(url, {
        token: token,
        headers: new Headers({ Accept: 'multipart/form-data' }),
      });

      let { featuresTabular, featuresChart } =
        await parseFeatureDetailsResponse(response);

      return { featuresTabular, featuresChart };
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async saveLabelCategory(token, albumID, labelType, name) {
    try {
      const url = `${endpoints.labelCategories}/${albumID}`;

      const data = { label_type: labelType, name };

      return await request(url, {
        token: token,
        data: data,
        method: 'POST',
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async editLabelCategory(token, labelCategoryID, name) {
    try {
      const url = `${endpoints.labels}/${labelCategoryID}`;

      const data = { name };

      return await request(url, {
        token: token,
        data: data,
        method: 'PATCH',
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async deleteLabelCategory(token, labelCategoryID) {
    try {
      const url = `${endpoints.labels}/${labelCategoryID}`;

      return await request(url, {
        token: token,
        method: 'DELETE',
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async labelCategories(token, albumID) {
    try {
      const url = `${endpoints.labelCategories}/${albumID}`;

      return await request(url, {
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async saveLabels(token, labelCollectionID, labelMap, posLabel) {
    try {
      const url = `${endpoints.labels}/${labelCollectionID}`;

      console.log('labelMap', labelMap);
      let data = { label_map: labelMap };
      if (posLabel) data.pos_label = posLabel;

      return await request(url, { method: 'POST', data: data, token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async saveClinicalFeaturesValues(token, clinicalFeatureMap, album_id) {
    try {
      let data = {
        clinical_feature_map: clinicalFeatureMap,
        album_id: album_id,
      };
      let url = `${endpoints.clinicalFeatures}?album_id=${album_id}`;
      return await request(url, { method: 'POST', data: data, token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async loadClinicalFeatures(token, patient_ids, album_id) {
    try {
      let url = `${endpoints.clinicalFeatures}?album_id=${album_id}`;

      return await request(url, {
        method: 'POST',
        token: token,
        data: { patient_ids: patient_ids },
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async filterClinicalFeatures(token, clinicalFeatureMap) {
    const url = `${endpoints.clinicalFeatures}/filter`;
    let data = { clinical_feature_map: clinicalFeatureMap };

    return await request(url, { method: 'POST', data: data, token: token });
  }

  async clinicalFeaturesUniqueValues(
    token,
    clinicalFeatureMap,
    clinicalFeaturesDefinitionsMap
  ) {
    const url = `${endpoints.clinicalFeatures}/unique-values`;
    let data = {
      clinical_feature_map: clinicalFeatureMap,
      clinical_features_definitions: clinicalFeaturesDefinitionsMap,
    };

    return await request(url, { method: 'POST', data: data, token: token });
  }

  async saveClinicalFeaturesDefinitions(
    token,
    clinicalFeaturesDefinitions,
    albumID
  ) {
    let data = {
      clinical_feature_definitions: clinicalFeaturesDefinitions,
      album_id: albumID,
    };
    let url = `${endpoints.clinicalFeaturesDefinitions}?album_id=${albumID}`;
    return await request(url, { method: 'POST', data: data, token: token });
  }

  async updateClinicalFeaturesDefinitions(
    token,
    clinicalFeaturesDefinitions,
    albumID
  ) {
    let data = {
      clinical_feature_definitions: clinicalFeaturesDefinitions,
      album_id: albumID,
    };
    let url = `${endpoints.clinicalFeaturesDefinitions}?album_id=${albumID}`;
    return await request(url, { method: 'PATCH', data: data, token: token });
  }

  async loadClinicalFeatureDefinitions(token, albumID) {
    let url = `${endpoints.clinicalFeaturesDefinitions}?album_id=${albumID}`;
    return await request(url, { method: 'GET', token: token });
  }

  async guessClinicalFeatureDefinitions(token, clinicalFeatureMap) {
    const url = `${endpoints.clinicalFeaturesDefinitions}/guess`;
    let data = { clinical_feature_map: clinicalFeatureMap };

    return await request(url, { method: 'POST', data: data, token: token });
  }

  async deleteClinicalFeatureDefinitions(token, albumID) {
    try {
      let url = `${endpoints.clinicalFeaturesDefinitions}?album_id=${albumID}`;
      return await request(url, {
        method: 'DELETE',
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async saveTrainingTestPatients(
    token,
    extractionID,
    collectionID,
    trainingPatients,
    testPatients
  ) {
    try {
      let url = collectionID
        ? `${endpoints.collections}/${collectionID}`
        : `${endpoints.extractions}/${extractionID}`;

      return await request(url, {
        method: 'PATCH',
        data: {
          training_patients: trainingPatients,
          test_patients: testPatients,
        },
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async models(token, albumID) {
    try {
      let url;
      if (albumID) url = `${endpoints.models}/${albumID}`;
      else url = `${endpoints.models}`;

      return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async deleteModel(token, modelID) {
    try {
      let url = `${endpoints.models}/${modelID}`;
      return await request(url, { method: 'DELETE', token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async downloadTestMetricsValues(token, modelID) {
    let url = `${endpoints.models}/${modelID}/download-test-bootstrap-values`;

    return downloadFile(url, token);
  }

  async downloadTestScoresValues(token, modelID) {
    let url = `${endpoints.models}/${modelID}/download-test-scores-values`;

    return downloadFile(url, token);
  }

  async downloadTestFeatureImportances(token, modelID) {
    let url = `${endpoints.models}/${modelID}/download-feature-importances`;

    return downloadFile(url, token);
  }

  async downloadConfiguration(token, extractionID) {
    let url = `${endpoints.extractions}/${extractionID}/download-configuration`;

    return downloadFile(url, token);
  }

  async downloadExtraction(token, extractionID) {
    let url = `${endpoints.extractions}/${extractionID}/download`;

    return downloadFile(url, token);
  }

  async downloadCollection(token, collectionID) {
    let url = `${endpoints.collections}/${collectionID}/download`;

    return downloadFile(url, token);
  }

  downloadExtractionURL(extractionID, patientID, studyDate, userID) {
    try {
      let url = `${endpoints.extractions}/${extractionID}/download`;
      if (userID) url += `?userID=${userID}`;
      return url;
      //return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  downloadCollectionURL(collectionID, patientID, studyDate, userID) {
    try {
      let url = `${endpoints.collections}/${collectionID}/download`;
      if (userID) url += `?userID=${userID}`;
      return url;
      //return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async extract(token, album_id, featureExtractionConfig, rois) {
    try {
      const url = `${endpoints.extract}/album/${album_id}`;
      return await request(url, {
        method: 'POST',
        data: { config: featureExtractionConfig, rois: rois },
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async trainModel(
    token,
    extractionID,
    collection,
    labelCategoryID,
    studies,
    album,
    labels,
    dataSplittingType,
    trainTestSplitType,
    trainingPatients,
    testPatients,
    usedModalities,
    usedROIs
  ) {
    try {
      const url = `${endpoints.models}/${album.album_id}`;
      return await request(url, {
        method: 'POST',
        data: {
          'extraction-id': extractionID,
          'collection-id': collection,
          'label-category-id': labelCategoryID,
          studies: studies,
          album: album,
          labels: labels,
          'data-splitting-type': dataSplittingType,
          'train-test-split-type': trainTestSplitType,
          'training-patients': trainingPatients,
          'test-patients': testPatients || null,
          modalities: usedModalities,
          rois: usedROIs,
        },
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async compareModels(token, modelIds){
    let url = `${endpoints.models}/compare`;
    let data = {
      "model_ids": modelIds,
    }
    return downloadFile(url, token, data);
  }

  async plotTestPredictions(token, modelID){
    let url = `${endpoints.models}/${modelID}/plot-test-predictions`;

    return downloadFile(url, token);
  }

  async plotTrainPredictions(token, modelID){
    let url = `${endpoints.models}/${modelID}/plot-train-predictions`;

    return downloadFile(url, token);
  }

  async presets(token) {
    try {
      const url = `${endpoints.presets}`;
      return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async preset(token, featurePresetID) {
    try {
      const url = `${endpoints.presets}/${featurePresetID}`;
      return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async tasks(token, studyUID) {
    try {
      const url = studyUID ? `${endpoints.tasks}/${studyUID}` : endpoints.tasks;
      return await request(url, { token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async createPreset(token, formData) {
    try {
      const url = endpoints.presets;

      return await request(url, {
        method: 'POST',
        data: formData,
        token: token,
        multipart: true,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async updatePreset(token, featurePresetID, formData) {
    try {
      const url = `${endpoints.presets}/${featurePresetID}`;

      return await request(url, {
        method: 'PATCH',
        data: formData,
        token: token,
        multipart: true,
      });
    } catch (err) {
      throw err;
    }
  }

  async saveCollectionNew(
    token,
    featureExtractionID,
    name,
    featureIDs,
    dataSplittingType,
    trainTestSplitType,
    trainingPatients,
    testPatients
  ) {
    try {
      const url = `${endpoints.collections}/new`;

      let body = {
        featureExtractionID: featureExtractionID,
        name: name,
        featureIDs: featureIDs,
        dataSplittingType: dataSplittingType,
        trainTestSplitType:
          dataSplittingType === DATA_SPLITTING_TYPES.TRAIN_TEST_SPLIT
            ? trainTestSplitType
            : TRAIN_TEST_SPLIT_TYPES.AUTO,
        trainingPatients: trainingPatients,
        testPatients: testPatients,
      };

      return await request(url, {
        method: 'POST',
        data: body,
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async updateCollection(token, featureCollectionID, fields) {
    try {
      const url = `${endpoints.collections}/${featureCollectionID}`;

      return await request(url, {
        method: 'PATCH',
        data: fields,
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async deleteCollection(token, featureCollectionID) {
    try {
      const url = `${endpoints.collections}/${featureCollectionID}`;
      return await request(url, { method: 'DELETE', token: token });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async collectionsByExtraction(token, featureExtractionID) {
    try {
      const url = `${endpoints.collections}/extraction/${featureExtractionID}`;

      return await request(url, {
        token: token,
      });
    } catch (err) {
      throw err; // Just throw it for now
    }
  }

  async collectionDetails(token, collectionID) {
    try {
      const url = `${endpoints.collections}/${collectionID}`;

      return await request(url, { token: token });
    } catch (err) {
      throw err;
    }
  }

  async saveNavigation(token, path) {
    try {
      const url = endpoints.navigation;

      return await request(url, {
        token: token,
        method: 'POST',
        data: { path: path },
      });
    } catch (err) {
      throw err;
    }
  }

  async albumROIs(token, albumID, force) {
    try {
      let url = !force
        ? `${endpoints.albums}/${albumID}`
        : `${endpoints.albums}/${albumID}/force`;

      return await request(url, { token: token, method: 'GET' });
    } catch (err) {
      throw err;
    }
  }

  async getCurrentOutcome(token, albumID) {
    try {
      let url = `${endpoints.albums}/${albumID}/current-outcome`;

      return await request(url, { token: token });
    } catch (err) {
      throw err;
    }
  }

  async saveCurrentOutcome(token, albumID, labelCategoryID) {
    try {
      let url = `${endpoints.albums}/${albumID}/current-outcome`;

      if (labelCategoryID) url += `/${labelCategoryID}`;

      return await request(url, { token: token, method: 'PATCH' });
    } catch (err) {
      throw err;
    }
  }
}

export default new Backend();
