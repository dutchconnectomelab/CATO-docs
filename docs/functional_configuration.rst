Functional configuration
===========================

general step
--------------------------------------------------------

.. glossary::

	fslRootDir	
			:default: ``"/Applications/fsl/5.0.10"``
			:description: FSL home directory.

	freesurferRootDir	
			:default: ``"/Applications/freesurfer/6.0.0"``
			:description: Freesurfer home directory.

	parameterPropertiesFile	
			:default: ``"functionalParameterProperties.xlsx"``
			:description: Datasheet with overview, requirements and descriptions of CATO parameters.

	templates	
			:default: ``["aparc","economo","BB50human","lausanne120","lausanne250"]``
			:description: List of parcellation templates used to reconstruct connectivity matrices and region properties.

	reconstructionSteps	
			:default: ``["functional_preprocessing","parcellation","collect_region_properties","compute_motion_metrics","reconstruction_functional_network"]``
			:description: List of pipeline steps that will be executed.

	freesurferDir	
			:default: ``"T1/SUBJECT_FS"``
			:description: Directory with output files of Freesurfer's recon-all function.

	templatesDir	
			:default: ``"TOOLBOXDIR/templates"``
			:description: Directory with template directories.

	ROIsFile	
			:default: ``"TEMPLATESDIR/TEMPLATE/ROIs_TEMPLATE.txt"``
			:description: File with on each line region codes (as defined by the lookup table) that define the nodes (and order of nodes) corresponding to the regions in the output connectivity matrices and region properties.

	outputDir	
			:default: ``"fMRI_processed"``
			:description: Output directory in which all generated files are stored (except additional Freesurfer files that are saved in the subject's Freesurfer directory).

	logFile	
			:default: ``"OUTPUTDIR/functional_pipeline.log"``
			:description: Log file. In case of consecutive runs the file will be appended.

	statusFile	
			:default: ``"OUTPUTDIR/functional_pipeline.STATUS"``
			:description: Status file describing progress of CATO. Steps are either in "running", "error" or "finished" state.

	computedConfigFile	
			:default: ``"OUTPUTDIR/functional_configuration.json"``
			:description: File with configuration parameters that were effectively used in processing a subject.

	maxNumberCompThreads	
			:default: ``1``
			:description: Maximum number of computational threads used in pipeline. Value 0 lets MATLAB determine the most desirable number of computational threads (equal to the number of physical cores on the machine).

functional_preprocessing step
--------------------------------------------------------

.. glossary::

	fmriFile	
			:default: ``"fMRI/SUBJECT_fmri.nii.gz"``
			:description: Input fMRI file.

	fmriProcessedFile	
			:default: ``"OUTPUTDIR/SUBJECT_fmri.nii.gz"``
			:description: Pre-processed fMRI file.

	motionParametersFile	
			:default: ``"OUTPUTDIR/SUBJECT_motion_parameters.par"``
			:description: Motion parameters file. The format is expected to be like a motion parameters file created by MCFLIRT.

	fmriReferenceFile	
			:default: ``"OUTPUTDIR/SUBJECT_ref.nii.gz"``
			:description: Reference file to which fMRI data is registered.

	registrationMatrixFile	
			:default: ``"OUTPUTDIR/SUBJECT_ref_to_freesurfer.dat"``
			:description: Registration matrix describing the transform between the fmriReferenceFile and Freesurfer space (as created by bbregister).

	segmentationFile	
			:default: ``"OUTPUTDIR/SUBJECT_aseg_ref.nii.gz"``
			:description: Freesurfer segmentation in fMRI space. The segmentation is mapped from Freesurfer to fMRI space using mri_label2vol with the registration matrix (from registrationMatrixFile) as input.

	sliceTimingCorrection	
			:default: ``true``
			:description: Flag whether slice timing should be corrected (using FSL sliceTimer).

	sliceTimerOptions	
			:default: ``""``
			:description: Optional input arguments for FSL slicetimer. The example preprocessing script executes the following code: "slicetimer -i fmriFileInput -o fmriFileOutput sliceTimerOptions".

	fmriInfo	
			:default: ``""``
			:description: Adjust variables in the fmriProcessedFile header (using mri_convert). Options are provided as structure (e.g. fmriInfo:{"tr": TR in msec, "te": TE in msec}). If emtpy, header is not changed.

	preprocessingScript	
			:default: ``"TOOLBOXDIR/functional_preprocessing/preprocess_default.sh"``
			:description: Bash script that will be executed to run pre-processing on the input data.

parcellation step
--------------------------------------------------------

.. glossary::

	forceFreesurferOverwrite	
			:default: ``false``
			:description: Flag whether the parcellation step should overwrite (if set to TRUE) already existing Freesurfer files.

	parcellationFile	
			:default: ``"OUTPUTDIR/SUBJECT_TEMPLATE+aseg_ref.nii.gz"``
			:description: Parcellation of the fmriReferenceFile for each of the applied templates.

	templateScript	
			:default: ``"TEMPLATESDIR/TEMPLATE/parcellate_TEMPLATE.sh"``
			:description: Bash script that performs parcellation steps.

	matchROIs	
			:default: ``true``
			:description: Flag whether the parcellation step should reassign the ROIs in the parcellationFile to match the template's color lookup table.

	lutFile	
			:default: ``"TEMPLATESDIR/TEMPLATE/TEMPLATE.annot.ctab"``
			:description: Freesurfer's color lookup table of the template.

collect_region_properties step
--------------------------------------------------------

.. glossary::

	statsLhFile	
			:default: ``"FREESURFERDIR/stats/lh.TEMPLATE.stats"``
			:description: Freesurfer's left-hemisphere stats file.

	statsRhFile	
			:default: ``"FREESURFERDIR/stats/rh.TEMPLATE.stats"``
			:description: Freesurfer's right-hemisphere stats file.

	statsSubFile	
			:default: ``"FREESURFERDIR/stats/aseg.stats"``
			:description: Freesurfer's subcortical stats file.

	regionPropertiesFile	
			:default: ``"OUTPUTDIR/SUBJECT_region_properties_TEMPLATE.mat"``
			:description: MATLAB file including region properties (center of mass of each region, the number of vertices, surface area mm2, gray matter volume mm3, average thickness mm for each region in the ROIsFile.

compute_motion_metrics step
--------------------------------------------------------

.. glossary::

	motionMetricsFile	
			:default: ``"OUTPUTDIR/SUBJECT_motion_metrics.mat"``
			:description: MATLAB file with motion metrics (DVARS and FD).

reconstruction_functional_network step
--------------------------------------------------------

.. glossary::

	methodDescription	
			:default: ``"scrubbed_0.01-0.1"``
			:description: Name of reconstruction method. Can be referenced in other parameters with METHOD.

	reconstructionMethod	
			:default: ``"corr"``
			:description: Functional connectivity estimation method used.

	connectivityMatrixFile	
			:default: ``"OUTPUTDIR/SUBJECT_connectivity_METHOD_TEMPLATE.mat"``
			:description: MATLAB file with connectivity matrices for the used reconstruction methods and templates. File includes variables: weightDescriptions, ROIs, regionDescriptions, connectivity. ROIs is a list of the segmentation codes of the regions included in the connectivity matrix. regionDescriptions is a list of the names of the regions included in the connectivity matrix. weightDescriptions is a list of the measures by which connections are weighted in the connectivity matrix. Connectivity is a Nregion x Nregion x Nweighting variable that contains the connectivity matrices for all weightings.

	timeSeriesFile	
			:default: ``"OUTPUTDIR/SUBJECT_time_series_METHOD_TEMPLATE.mat"``
			:description: MATLAB file with time series for the used reconstruction methods and templates.

	minRepetitionTime	
			:default: ``100``
			:description: Repetition times smaller than minRepetitionTime are considered erros. This provides a check avoid issues due to different time measures (seconds versus milliseconds).

	regression.regressionMask	
			:default: ``[24,2,41,251,252,253,254,255]``
			:description: List of FreeSurfer region codes (from the standard segmentation map, aseg.mgz) of voxels that will be used as regressor. The average signal of voxels for each region code is included as a regressor.

	regression.globalMeanRegression	
			:default: ``false``
			:description: Flag whether global signal regression should be performed.

	bandpass_filter.filter	
			:default: ``true``
			:description: Flag whether bandpass filtering should be performed.

	bandpass_filter.frequencies	
			:default: ``[0.01,0.1]``
			:description: High- and low-pass frequencies.

	scrubbing.scrubbing	
			:default: ``true``
			:description: Flag whether scrubbing should be performed.

	scrubbing.maxFD	
			:default: ``0.25``
			:description: Frames with FD higher than maxFD are indicated to contain a violation.

	scrubbing.maxDVARS	
			:default: ``1.5``
			:description: Frames with DVARS larger than Q3 + maxDVARS × IQR are indicated to contain a violation.

	scrubbing.minViolations	
			:default: ``2``
			:description: Frames with a number of violations larger or equal to minViolations are considered to contain motion artifacts and scrubbed from further analyses.

	scrubbing.backwardNeighbors	
			:default: ``1``
			:description: Number of frames preceding a violating-frame that are also excluded from analyses.

	scrubbing.forwardNeighbors	
			:default: ``0``
			:description: Number of frames succeeding a violating-frame that are also excluded from analyses.

	saveTimeSeries	
			:default: ``true``
			:description: Flag indicating whether time series are saved to timeSeriesFile.

