.. _functional_pipeline:

==============================
Functional pipeline 
==============================

The functional connectivity pipeline builds upon the same modular organization as the :ref:`structural connectivity pipeline<structural_pipeline>`, including a preprocessing stage, anatomical stage and connectivity reconstruction stage. Resting-state fMRI processing starts with the main function :ref:`functional_pipeline <functional_pipeline>` that runs the processing steps according to the parameters provided on the command line or in the :ref:`functional configuration file <Functional configuration>`. 

.. _functional_preprocessing:

Preprocessing
----------------------------------------------------
The preprocessing step :ref:`functional_preprocessing <functional_preprocessing>` provides users the option to preprocess rs-fMRI data with their preferred software package, specified by :term:`preprocessingScript`. Further details on using a custom preprocessing script are provided in the structural pipeline section (see :ref:`Custom preprocessing script<structural_custom_preprocessing_script>`).

CATO provides an example preprocessing script ``preprocess_default.sh`` that:
	1. performs slice timing correction using FSL tool `sliceTimer <http://poc.vl-e.nl/distribution/manual/fsl-3.2/slicetimer/index.html>`_,
		In the provided preprocessing script, parameter :term:`sliceTimingCorrection` informs whether slice timing correction should be performed (``true`` or ``false``) and :term:`sliceTimerOptions` are the optional input arguments to sliceTimer::

			slicetimer -i fmriFileInput -o fmriFileOutput slicetimerOptions

		That can be specified in the configuration file as follows:

			.. code-block:: JSON

				"functional_preprocessing":{
					"sliceTimingCorrection":true,
					"sliceTimerOptions": "YOUR_OPTIONS"
				}


	2. performs motion correction using FSL tool `MCFLIRT <https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/MCFLIRT>`_,
	3. computes a rs-fMRI reference image by averaging all (motion corrected) rs-fMRI frames (using FSL),
	4. computes the registration matrix between the rs-fMRI reference image and the T1 image :cite:`RN663` (using Freesurfer) and
	5.  registers the T1 parcellation to the reference rs-fMRI image (using Freesurfer).

Anatomical steps
----------------------------------------------------
The functional pipeline utilizes the same anatomical as the structural pipeline to parcellate the surface into brain regions with respect to reference atlases, compute the anatomical statistics of these regions and collect the region properties of these statistics into the region properties file :term:`regionPropertiesFile`.

See the :ref:`anatomical steps<anatomical_steps>` section in the structural pipeline for a description of the :ref:`parcellation` and :ref:`collect_region_properties` steps.

.. _compute_motion_metrics:

Compute motion metrics
----------------------------------------------------
:ref:`Compute_motion_metrics <compute_motion_metrics>` computes for each frame the motion metrics 'framewise displacement' (FD) and the change in signal intensity between frames (known as ‘DVARS’) :cite:`RN50`. Both measures are derived from the :term:`motionParametersFile` file (which can for example be obtained using MCFLIRT :cite:`RN679`) and saved in the :term:`motionMetricsFile`.

Following the implementation of Power et al., :cite:`RN50` framewise displacement (FD) is defined as the sum of the estimated translational and rotational displacement in a frame. Rotational displacement should be provided in degrees by the :term:`motionParametersFile` file, and is subsequently converted to millimeters by calculating the expected displacement on the surface of a sphere of radius 50 mm as model for the cerebral cortex following :cite:`RN50`. DVARS is calculated as the square root of the average squared intensity differences of all brain voxels between two consecutive frames in the rs-fMRI volume :cite:`RN50`.

.. _reconstruction_functional_network:

Network reconstruction
----------------------------------------------------
The :ref:`reconstruction_functional_network <reconstruction_functional_network>` step computes region-to-region functional connectivity by means of correlation analysis, preceded by three (optional) steps.

Step 1. Regression
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
First, the regression step removes covariates (referred to as regressors) from the signal intensity time series of the rs-fMRI data. Per voxel, regressors are removed from the signal intensity time series by calculating the residuals of a linear model of the signal intensities with the regressors as predictors. Standard regressors include:
	- the linear trends of the six motion parameters (from :term:`motionParametersFile`),
	- first order drifts of the six motion parameters (from :term:`motionParametersFile`) and
	- mean signal intensity of voxels in white matter and CSF (specific regions are defined by configuration parameter :term:`regression.regressionMask`). Each region code in the regression mask is included as separate regressor.

	**Optionally**, the mean signal intensity of all voxels in the brain can be included as an additional regressor to perform global mean correction (indicated by :term:`regression.globalMeanRegression`) :cite:`RN680`.


Step 2. Bandpass filter (optional)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The next step is applying a band-pass filter to the rs-fMRI data (indicated by parameter :term:`bandpass_filter.filter`). Filtering frequencies aims to remove noise frequencies such as low frequencies that result from scanner drift, coil interference, slow motions or slow vascular oscillations as well as high frequencies that include artifacts from from breathing or heart beats (`More information <https://en.wikibooks.org/wiki/Neuroimaging_Data_Processing/Temporal_Filtering>`_). A standard zero-phase Butterworth bandpass filter is used with lower and higher cutoff frequencies set by the configuration parameter :term:`bandpass_filter.frequencies`.

Step 3. Scrubbing (optional)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Frames that display significant motion artifacts are (optionally) removed from the rs-fMRI time-series in the scrubbing-step :cite:`RN50`. When scrubbing is enabled (determined by the parameter :term:`scrubbing.scrubbing`), frames with motion artifacts are identified based on two indicators: 

	- having framewise displacement FD larger than :term:`scrubbing.maxFD` and
	- having a DVARS larger than Q3 + :term:`scrubbing.maxDVARS` × IQR,

where IQR refers to the the interquartile range IQR = Q3 – Q1, with Q1 and Q3 referring to the first and third quartile of the DVARS over all frames. Frames with a number of indicators larger or equal to :term:`scrubbing.minViolations` are labeled as frames with potential motion artifacts and are excluded from further analysis. To accommodate temporal smoothing of data, frames consecutive to frames with labeled motion artifacts are optionally excluded: configuration parameter :term:`scrubbing.backwardNeighbors` determines the number of preceding frames and :term:`scrubbing.forwardNeighbors` determines the number of succeeding frames to be excluded from further analysis.

Step 4. Correlation Analysis
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Functional connectivity is computed between brain regions (specified by the :term:`ROIsFile`) as the Pearson’s correlation of the average signal intensity of these regions across the selected frames. Connectivity matrices are saved to the file :term:`connectivityMatrixFile` and time series of each region are saved to the file :term:`timeSeriesFile`.






