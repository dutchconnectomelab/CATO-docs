Structural configuration
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

	templates	
			:default: ``["aparc","economo","BB50human","lausanne120","lausanne250","lausanne500"]``
			:description: List of parcellation templates used to reconstruct connectivity matrices and region properties.

	reconstructionMethods	
			:default: ``["DTI","CSD","GQI","GQI_DTI"]``
			:description: List of reconstruction methods by which diffusion peaks and diffusion measures are reconstructed.

	reconstructionSteps	
			:default: ``["structural_preprocessing","parcellation","collect_region_properties","reconstruction_diffusion","reconstruction_fibers","reconstruction_fiber_properties","reconstruction_network"]``
			:description: List of pipeline steps that will be executed.

	general.FAMeasure	
			:default: ``{"DTI":"fractional anisotropy","CSD":"fractional anisotropy","CSD_DTI":"fractional anisotropy","GQI":"normalized generalized fractional anisotropy","GQI_DTI":"normalized generalized fractional anisotropy"}``
			:description: FA measure used in fiber reconstruction process. Dependent on the method this can be fractional anisotropy or e.g. generalized fractional anisotropy.

	bValueZeroThreshold	
			:default: ``100``
			:description: B-values smaller or equal to this threshold are assumed to indicate b0-scans and set to b-value = 0.

	bValueScalingTol	
			:default: ``0.01``
			:description: B-vectors with a norm that deviates from 1 more than this threshold are labeled as potentially non-unit gradients.

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
			:default: ``"DWI_processed"``
			:description: Output directory in which all generated files are saved (except additional Freesurfer files that are saved in the subject's Freesurfer directory).

	logFile	
			:default: ``"OUTPUTDIR/structural_pipeline.log"``
			:description: Log file. In case of consecutive runs the file will be appended.

	statusFile	
			:default: ``"OUTPUTDIR/structural_pipeline.STATUS"``
			:description: Status file describing progress of CATO. Steps are either in "running", "error" or "finished" state.

	computedConfigFile	
			:default: ``"OUTPUTDIR/structural_configuration.json"``
			:description: File with configuration parameters that were effectively used in processing a subject.

	maxNumberCompThreads	
			:default: ``1``
			:description: Maximum number of computational threads used in pipeline. Value 0 lets MATLAB determine the most desirable number of computational threads (equal to the number of physical cores on the machine).

	maxMemoryGB	
			:default: ``2``
			:description: Approximate maximum memory used in the reconstruction fibers step of the structural pipeline (in gigabytes).

structural_preprocessing step
--------------------------------------------------------

.. glossary::

	rawBvalsFile	
			:default: ``"DTI/SUBJECT.bvals"``
			:description: File with b-values of the DWI scans.

	rawBvecsFile	
			:default: ``"DTI/SUBJECT.bvecs"``
			:description: File with b-vectors of the DWI scans (in column or row format).

	dwiFile	
			:default: ``"DTI/SUBJECT_DTI.nii.gz"``
			:description: DWI file in (gzip compressed) nifti format.

	dwiB0ReversedFile	
			:default: ``""``
			:description: DWI dataset with b0-weighted scans with reversed phase encodings. If no reversed phase encoded scans are acquired this parameter can be left empty.

	dwiReversedFile	
			:default: ``""``
			:description: Full DWI dataset with scans with reversed phase encodings. If no reversed phase encoded scans are acquired this parameter can be left empty.

	preprocessingScript	
			:default: ``"TOOLBOXDIR/structural_preprocessing/preprocess_minimal.sh"``
			:description: Bash script that will be executed to run specific pre-processing steps on the input data.

	eddyVersion	
			:default: ``"eddy_openmp"``
			:description: Name of eddy executable specifying whether eddy_openmp or eddy_cuda should be used.

	acqpFactor	
			:default: ``0.085``
			:description: Time (in seconds) between reading the center of the first echo and reading the center of the last echo. Input parameter of FSL eddy. See: https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddy/Faq.

	revPhaseEncDim	
			:default: ``1``
			:description: The dimension in the DWI file that corresponds with the phase encoding direction. For details see: https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/topup/TopupUsersGuide/#A--datain.

	registrationMatrixFile	
			:default: ``"OUTPUTDIR/SUBJECT_b0_to_freesurfer.dat"``
			:description: Registration matrix describing the transform between the referenceFile and Freesurfer space.

	dwiReferenceFile	
			:default: ``"OUTPUTDIR/SUBJECT_dwi_b0.nii.gz"``
			:description: Reference file with the average b0 scans of the DWI dataset.

	processedBvalsFile	
			:default: ``"OUTPUTDIR/bvals_processed.txt"``
			:description: File with b-values of the DWI scans after possible adjustments (e.g. rotation of b-vectors) in the structural_preprocessing script.

	processedBvecsFile	
			:default: ``"OUTPUTDIR/bvecs_processed.txt"``
			:description: File with b-vectors of the DWI scans after possible adjustments (e.g. rotation of b-vectors) in the structural_preprocessing script.

	indexFile	
			:default: ``"OUTPUTDIR/index.txt"``
			:description: File that informs FSL eddy on the relation between the diffusion file and acquisition parameters. See: https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddy/UsersGuide.

	acqpFile	
			:default: ``"OUTPUTDIR/acqp.txt"``
			:description: Acquisition parameters file. Input file for FSL eddy. See: https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddy/UsersGuide.

	dwiProcessedFile	
			:default: ``"OUTPUTDIR/SUBJECT_dwi.nii.gz"``
			:description: Preprocessed DWI file. For example corrected for motion, eddy-currents and susceptibility artifacts.

	segmentationFile	
			:default: ``"OUTPUTDIR/SUBJECT_aseg_b0.nii.gz"``
			:description: Freesurfer segmentation mapped onto the DWI reference file.

parcellation step
--------------------------------------------------------

.. glossary::

	forceFreesurferOverwrite	
			:default: ``false``
			:description: Flag whether the parcellation step should overwrite (if set to TRUE) already existing Freesurfer files.

	parcellationFile	
			:default: ``"OUTPUTDIR/SUBJECT_TEMPLATE+aseg_b0.nii.gz"``
			:description: Parcellation of the DWI reference file for each applied template.

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

reconstruction_diffusion step
--------------------------------------------------------

.. glossary::

	DTI.thresCondNum	
			:default: ``[]``
			:description: Threshold condition number for selecting non-outlying measurements. If this variable is empty, then this threshold is automatically estimated.

	DTI.thresVarProjScores	
			:default: ``[]``
			:description: Threshold on the variation in the average projection scores for selecting non-outlying measurements. If this variable is empty, then this threshold is automatically estimated.

	CSD.lambda	
			:default: ``1``
			:description: Regularization parameter controlling the coarseness of the reconstructed peak profile. The estimated FOD is relatively sensitive to noise for low values of :term:`lambda` and more robust, but with lower angular resolution and broader peaks, for large :term:`lambda`.

	CSD.shOrder	
			:default: ``6``
			:description: Order of the spherical harmonics that are used in the CSD reconstruction.

	CSD.tau	
			:default: ``0.1``
			:description: Amplitude below which the corresponding fODF is assumed to zero. The effective threshold is :term:`tau` times the mean FOD amplitude.

	CSD.CCRegions	
			:default: ``[251,252,253,254,255]``
			:description: List of region codes that correspond to the Corpus Callosum as used in the :term:`segmentationFile` that are used to estimate the reference response function.

	CSD.FAThreshold	
			:default: ``0.7``
			:description: Minimum fractional anisotropy threshold for voxels to be used as estimators of the reference response function.

	CSD.outputPeaks	
			:default: ``4``
			:description: Maximum number of peaks per voxel included in the diffusion peaks file.

	CSD.minPeakRatio	
			:default: ``0.1``
			:description: Parameter controlling the sensitivity to detect peaks. Diffusion peaks with a normalized coefficient (i.e. the coefficient of the peak divided by the maximum coefficient) smaller than :term:`minPeakRatio` are discarded.

	CSD.maxPeaks	
			:default: ``8``
			:description: Number of identified peaks beyond which a voxel is considered isotropic.

	GQI.meanDiffusionDistanceRatio	
			:default: ``1.25``
			:description: Parameter regulating the coarseness of the reconstructed peak profile. High values provide, theoretically, a more accurate reconstruction, but also increase sensitivity to noise.

	GQI.outputPeaks	
			:default: ``4``
			:description: Maximum number of peaks per voxel included in the diffusion peaks file.

	GQI.minPeakRatio	
			:default: ``0.1``
			:description: Parameter controlling the sensitivity to detect peaks. Diffusion peaks with a normalized coefficient (i.e. the coefficient of the peak divided by the maximum coefficient) smaller than :term:`minPeakRatio` are discarded.

	GQI.maxPeaks	
			:default: ``8``
			:description: Number of identified peaks beyond which a voxel is considered isotropic.

	diffusionPeaksFile	
			:default: ``"OUTPUTDIR/SUBJECT_diffusion_peaks_METHOD.mat"``
			:description: MATLAB file the diffusion peak directions of each voxel. Diffusion peaks are saved in a Nx3xM matrix containing for N voxels at most M diffusion peaks for each voxel. The first index corresponds to the linear index of the voxel and the third index reflects the prominence of the diffusion peak (the strongest peak having the lowest index). The second dimension describes the direction of the diffusion peaks.

	diffusionMeasuresFile	
			:default: ``"OUTPUTDIR/SUBJECT_diffusion_measures.mat"``
			:description: MATLAB file with the computed diffusion measures per voxel. File contains a weightDescriptions variable that describes the included diffusion measures and a N1xN2xN3xNw diffusionMeasures variable that describes for each voxel in the diffusion image (with dimensions N1xN2xN3) the measurements for the Nw diffusion measures.

	exportNifti.exportNifti	
			:default: ``true``
			:description: Flag indicating pipeline exports NIFTI file with diffusion measurements.

	exportNifti.measures	
			:default: ``["fractional anisotropy"]``
			:description: List of diffusion measures that are exported in NIFTI format.

	exportNifti.diffusionMeasuresFileNifti	
			:default: ``"OUTPUTDIR/SUBJECT_MEASURE.nii.gz"``
			:description: NIFTI file with diffusion measurements.

	gradientNonlinearities.correctNonlinearities	
			:default: ``false``
			:description: Flag indicating voxel-wise gradient correction in diffusion reconstruction step.

	gradientNonlinearities.nonlinearitiesFile	
			:default: ``""``
			:description: NIFTI file with voxel-wise gradient corrections.

reconstruction_fibers step
--------------------------------------------------------

.. glossary::

	NumberOfSeedsPerVoxel	
			:default: ``8``
			:description: Number of seeds per voxel from which fiber reconstructions are started.

	maxAngleDeg	
			:default: ``45``
			:description: Largest turn in degrees a fiber is allowed to take. Fiber reconstruction stops if a tracker is about to make a sharp turn (with angle > :term:`maxAngleDeg`).

	minFA	
			:default: ``0.1``
			:description: Minimum fractional anisotropy that a fiber is allowed to cross. Fiber reconstruction stops if a tracker entered a region with FA < :term:`minFA`.

	maxFiberRadius	
			:default: ``500``
			:description: Maximum number of steps from seed to endpoints. Fiber reconstruction stops if the number of steps from the seed is larger than :term:`maxFiberRadius`. (Maximum length of fibers in mm depends on the voxel size).

	forbiddenRegions	
			:default: ``[1,6,7,8,40,45,46,47]``
			:description: List of region codes (from the standard segmentation map, aseg.mgz) of voxels, which if fibers that enter one of these regions then these fibers are not included in the reconstructed fiber cloud.

	stopRegions	
			:default: ``[16,28,60]``
			:description: List of region codes (from the standard segmentation map, aseg.mgz) of voxels where fiber tracking will stop if the tracker enters these voxels.

	startRegions	
			:default: ``[2,41,251,252,253,254,255]``
			:description: List of region codes (from the standard segmentation map, aseg.mgz) of voxels from which fiber tracking will start.

	fiberFile	
			:default: ``"OUTPUTDIR/SUBJECT_fibers_METHOD.trk"``
			:description: TRK file in which the reconstructed fiber cloud is saved. See: http://trackvis.org/docs/?subsect=fileformat.

reconstruction_fiber_properties step
--------------------------------------------------------

.. glossary::

	includeGMVoxelsFlag	
			:default: ``false``
			:description: Flag indicating fiber segments should be reconstructed in line with old versions of this reconstruction software (for compatibility).

	fiberPropertiesFile	
			:default: ``"OUTPUTDIR/SUBJECT_fiber_properties_METHOD_TEMPLATE.mat"``
			:description: MATLAB file with information about fiber segments and associated diffusion measures and connections.

reconstruction_network step
--------------------------------------------------------

.. glossary::

	maxAngleDeg	
			:default: ``180``
			:description: Largest turn in degrees a fiber is allowed to take. Fiber reconstruction stops if a tracker is about to make a sharp turn (with angle > :term:`maxAngleDeg`).

	minLengthMM	
			:default: ``0``
			:description: Minimal fiber length (in mm) for a fiber to be included in the reconstructed connectivity matrix.

	minFA	
			:default: ``0``
			:description: Minimum fractional anisotropy that a fiber is allowed to touch to be included in the reconstructed connectivity matrix.

	connectivityMatrixFile	
			:default: ``"OUTPUTDIR/SUBJECT_connectivity_METHOD_TEMPLATE.mat"``
			:description: File with connectivity matrices for the used reconstruction methods and templates. File includes variables: weightDescriptions, ROIs, regionDescriptions, connectivity. ROIs is a list of the segmentation codes of the regions included in the connectivity matrix. regionDescriptions is a list of the names of the regions included in the connectivity matrix. weightDescriptions is a list of the measures by which connections are weighted in the connectivity matrix. Connectivity is a Nregion x Nregion x Nweighting variable that contains the connectivity matrices for all weightings.

