 .. role:: yes
 	:class: alert-success

.. role:: no
	:class: alert-danger 

.. role:: unkown
	 :class: alert-info  

.. role:: todo
	:class: alert-danger

.. _structural_pipeline:
  
====================
Structural pipeline
====================
Diffusion weighted MRI processing of a subject starts with the main function :ref:`structural_pipeline <structural_pipeline>` that executes processing steps with reconstruction parameters specified on the command line or in a configuration file in JSON-format. Parameters in the user provided configuration file overwrite the default parameters and parameters specified on the command line overwrite both. The :ref:`Structural configuration` page gives an overview of all parameters in the structural configuration file.

Structural preprocessing
----------------------------------

The :ref:`preprocessing <preprocessing>` step takes FreeSurfer and DWI data and generates intermediate files for the consecutive processing steps. The structural preprocessing step executes preprocessing specified in a bash script (specified by the parameter :term:`preprocessingScript`).

Three example preprocessing scripts (``preprocess_topup_eddy.sh``, ``preprocess_eddy.sh`` and ``preprocess_minimal.sh``) are provided with the structural pipeline.

Script ``preprocess_topup_eddy.sh`` uses 

	1. `FSL Topup <https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/topup>`_ and `FSL eddy <https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddy>`_ to correct for susceptibility induced distortions, eddy current distortions and motion artifacts in the DWI data :cite:`RN228`,
		(using :term:`indexFile` and :term:`acqpFile`, and generating :term:`dwiProcessedFile`)
	2. updates the b-vectors to adjust for the DWI corrections :cite:`RN656`,
		(updated b-vectors and b-values are saved in :term:`processedBvalsFile` and :term:`processedBvecsFile`)
	3. computes a DWI reference image based on the corrected diffusion-unweighted (b0) volumes,
		(generating :term:`dwiReferenceFile`)
	4. computes the registration matrix between DWI reference image and the T1 image using `bbregister <https://surfer.nmr.mgh.harvard.edu/fswiki/bbregister>`_ :cite:`RN663` and
		(generating :term:`registrationMatrixFile`)
	5. registers the Freesurfer segmentation to the DWI reference image.
		(generating :term:`segmentationFile`)

The script ``preprocess_eddy.sh`` performs the same steps except correction for susceptibility induced distortions using FSL topup. The minimal-preprocessing script ``preprocess_minimal.sh`` does not perform any DWI data corrections (see Table below).

Users can use the example preprocessing scripts that fits best to their data, provide a completely custom preprocessing script, or exclude preprocessing all together and perform preprocessing separate from CATO (by excluding ``structural_preprocessing`` from the :term:`reconstructionSteps` parameter).


.. list-table:: Overview of preprocessing steps in provided preprocessing scripts. 
	:widths: 52 12 12 12 12
	:align: left
	:stub-columns: 1

	*	-
		- Minimal
		- Eddy
		- Topup Eddy
		- Custom
	*	- Correct susceptibility induced distortions (using FSL topup) 
		- :no:`no`
		- :no:`no`
		- :yes:`yes`
		- :unkown:`?`
	*	- Correct eddy current distortions and motion artifacts in the DWI data (using FSL eddy) :cite:`RN228`
		- :no:`no`
		- :yes:`yes`
		- :yes:`yes`
		- :unkown:`?`
	*	- Update vectors to adjust for the DWI corrections :cite:`RN656`
		- :no:`no`
		- :yes:`yes`
		- :yes:`yes`
		- :unkown:`?`
	*	- Compute a DWI reference image based on the diffusion unweighted (b0) volumes (using FSL)
		- :yes:`yes`
		- :yes:`yes`
		- :yes:`yes`
		- :unkown:`?`
	*	- Compute registration matrix between DWI reference image and the T1 image (using Freesurfer) :cite:`RN663`
		- :yes:`yes`
		- :yes:`yes`
		- :yes:`yes`
		- :unkown:`?`
	*	- Register the Freesurfer segmentation to the DWI reference image (using Freesurfer).
		- :yes:`yes`
		- :yes:`yes`
		- :yes:`yes`
		- :unkown:`?`	 

.. toggle-header::
    :header: **Show advanced notes**

	1. The example scripts use by default `eddy_openmp <https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/eddy/UsersGuide#The_eddy_executables>`_ executable. A different version of eddy can be specified in the :term:`eddyVersion` parameter.
	2. Sometimes the b-values file (:term:`rawBvalsFile` or :term:`processedBvalsFile`) contains nonzero b-values for scans that are intended as diffusion unweighted b0-scans.  However, diffusion reconstruction methods (often) assume b-values equal to 0 for diffusion unweighted scans. The pipeline accomodates this by putting all b-values that are smaller or equal to :term:`bValueZeroThreshold` to 0.
	3. The pipeline checks that the norm of all b-vectors is very close to one (i.e. all b-vectors are unit vectors). If the norm of any b-vector deviates from 1 more than :term:`bValueScalingTol`, then a warning is given on the command line. No b-value scaling or b-vector scaling is performed.

.. _anatomical_steps:

Anatomical steps 
----------------------------------

Parcellation 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:ref:`Parcellation <parcellation>` is an optional step that calls the FreeSurfer software suite to create additional cortical parcellations of the surface with respect to reference atlases. Standard atlases in CATO include:
	- ‘Desikan-Killiany’ atlas present in FreeSurfer :cite:`RN374`,
	- 120, 250 and 500 regions Cammoun sub-parcellations of the Desikan-Killiany atlas :cite:`RN254` and
	- `‘Von Economo-Koskinas’ <http://www.dutchconnectomelab.nl/economo/>`_ cortical region and cortical-type atlas :cite:`RN229,RN673`

CATO has a template directory (``TOOLBOXDIR/templates``). In this template directory, each atlas has a directory (named ``TEMPLATE``) with a parcellation script (``parcellate_TEMPLATE.sh``), a ROIs file (``ROIs_TEMPLATE.txt``) and template specific files. All filenames are defined as variables (:term:`templatesDir`, :term:`templateScript`, :term:`ROIsFile`) in the configuration file and can be adjusted.

Templates provided with the pipeline use FreeSurfer’s `mris_ca_label <https://surfer.nmr.mgh.harvard.edu/fswiki/mris_ca_label>`_ to create the annotation files,  `mri_aparc2aseg <https://surfer.nmr.mgh.harvard.edu/fswiki/mri_aparc2aseg>`_ to merge the cortical atlases with the sub-cortical ASEG parcellation and `mris_anatomical_stats <https://surfer.nmr.mgh.harvard.edu/fswiki/mris_anatomical_stats>`_ to provide for every template an anatomical stats file describing a.o. for each region:
	- the number of vertices
	- surface area (mm\ :sup:`2`)
	- gray matter volume (mm\ :sup:`3`)
	- average thickness (mm)

The modular character of CATO allows easy implementation of other surface based or volume based atlases by adding a template to the template directory and adding this new template to the general :term:`templates` parameter that specifies which templates are used in the pipeline.

.. toggle-header::
    :header: **Show advanced notes**

	Standard both functional and structural pipelines include the parcellation step. To avoid the re-computation of FreeSurfer atlas files and stat files and (very small) differences in regional properties between both pipelines, CATO checks whether FreeSurfer atlas files already exist. If a file already exists, then CATO does not overwrite this file. To force CATO to overwrite FreeSurfer files, set parameter :term:`forceFreesurferOverwrite` to ``true``.

.. _collect_region_properties:

Collect region properties
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The :ref:`collect_region_properties <collect_region_properties>` step collects volumetric and surface data from the regions of interest defined in the :term:`ROIsfile` and summarizes this data in the :term:`regionPropertiesFile`. The following statistics are included for every brain region:
	- center of mass of each region (calculated from the parcellation file :term:`parcellationFile`)
	- the number of vertices (from FreeSurfer output created in :ref:`the parcellation step<parcellation>`)
	- surface area (mm\ :sup:`2`) (from FreeSurfer)
	- gray matter volume (mm\ :sup:`3`) (from FreeSurfer)
	- average thickness (mm) (from FreeSurfer)

.. _reconstruction_diffusion:

Reconstruction diffusion
-----------------------------
The :ref:`reconstruction_diffusion <reconstruction_diffusion>` step estimates the white matter fiber organization in each voxel from the measured DWI data. Structural connectivity modeling is based on the principle that white matter fibers restrict the movement of water molecules resulting in peaks (preferred directions) in the diffusion patterns of water molecules. Pipeline step :ref:`reconstruction_diffusion <reconstruction_diffusion>` provides three methods to infer diffusion peaks from DWI data, including:
	- :ref:`Diffusion Tensor Imaging (DTI)`
	- :ref:`Constrained Spherical Deconvolution (CSD)`
	- :ref:`Generalized Q-sampling Imaging (GQI)`

The applied methods are specified by the :term:`reconstructionMethods` parameter::

	"reconstructionMethods": ["DTI", "CSD", "GQI", "GQI_DTI", "CSD_DTI"]	


Diffusion Tensor Imaging (DTI)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The DTI option models the measured signal of a voxel by a tensor and estimates one preferred diffusion-direction per voxel. CATO uses the informed RESTORE algorithm :cite:`RN238,RN250` to reduce the impact of physiological noise artifacts on the DTI modeling, performing tensor tensor estimation while identifying and removing outliers during the fitting procedure. The Levenberg-Marquardt method as implemented by Gavin et al. :cite:`RN675` is used to solve the nonlinear least squares problem.

.. toggle-header::
    :header: **Show advanced notes**

    1. The iRESTORE method identifies measurements that are outliers and that are excluded from the tensor fitting. To ensure that enough information is preserved for reliable tensor estimation the iRESTORE algorithm checks that the B-matrix is well conditioned and directionally balanced. If this is not the case then all measurements are used to perform the nonlinear least-squares fitting. The B-matrix is considered well-conditioned if the condition number is lower than :term:`thresCondNum <DTI.thresCondNum>` and directionally balanced if the variation in average projection scores is lower than :term:`thresVarProjScores <DTI.thresVarProjScores>`. The condition number and variation in average projection scores thresholds are specific for each gradient acquisition scheme and are therefore estimated by the function ``thresholdAssistant``. This function estimates both thresholds using a bootstrapped sample of gradient schemes obtained by randomly removing gradient directions from the original scheme. Following experience, as described in de Reus (2015), thresholds where chosen from the distribution such that:

		- The removal of 5% of the gradients was allowed for 75% of the samples.
		- And the removal of 50% of the gradients was allowed in 25% of the samples.
	
	For each threshold these two points were obtained across all permutations and the final thresholds were obtained by averaging the two points.
	2. The non-linear least squares fitting procedure used parameters suggested by Gavin et al. :cite:`RN675` (:math:`\epsilon_1` = 0.001, :math:`\epsilon_2` = 0.001, :math:`\epsilon_3` = 0.1, :math:`\epsilon_4` = 0.1, :math:`\lambda_{\uparrow}` = 11, :math:`\lambda_{\downarrow}` = 9, :math:`\lambda_0` = 0.01 and a maximum of 100 iterations).

Constrained Spherical Deconvolution (CSD)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Constrained spherical deconvolution reconstructs the diffusion peaks in a voxel by deconvolution of the measured signal with the diffusion profile associated with a fiber :cite:`RN165`. Signal deconvolution is performed in the super-resolved spherical harmonics framework to allow for a natural description of the surface of a diffusion process. The used implementation of spherical deconvolution is constrained to eliminate spherical harmonics with negative values which reduces high frequency noise resulting in the reconstruction of a few well-defined peaks :cite:`RN165`. The implementation in the pipeline follows the implementation as used in the `Dipy software package <https://dipy.org>`_ and as described in :cite:`RN165` and was extended to allow super-resolved reconstructions.

Generalized Q-sampling Imaging (GQI)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Generalized Q-sampling Imaging extrapolates the diffusion signal after which diffusion directions with the highest signal are selected as diffusion peaks. The implementation follows the method described in Yeh et al. :cite:`RN367` and the implementation as presented on http://dsi-studio.labsolver.org.

Combined implementation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Comparing the four reconstruction methods, DTI is a robust and simple method, whereas CSD and GQI are more advanced diffusion models that allow for the reconstruction of fibers in multiple directions, which is beneficial for voxels with a more complex white matter organization. To combine the strengths of simple and advanced reconstruction methods, CATO allows the user to combine DTI with CSD or GQI to perform DTI modeling in voxels with one peak and CSD or GQI in voxels with multiple detected peaks. 

Export diffusion measures to NIFTI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The :ref:`reconstruction_diffusion` step provides the user with the additional option to export diffusion measures to a NIFTI volume file :term:`diffusionMeasuresFileNifti <exportNifti.diffusionMeasuresFileNifti>`. To export fractional anisotropy, axial diffusivity, radial diffusivity and mean diffusivity measures to a file, add the following parameters to the ``reconstruction_diffusion`` section in the configuration file::

	"exportNifti":{
		"exportNifti": true,
		"measures": ["fractional anisotropy", "axial diffusivity", "radial diffusivity", "mean diffusivity"],
		"diffusionMeasuresFileNifti": "OUTPUTDIR/SUBJECT_MEASURE.nii.gz"
	}


.. _reconstruction_fibers:

Reconstruction fibers
--------------------------
The :ref:`reconstruction_fibers <reconstruction_fibers>` function performs fiber tracking based on the diffusion peaks of each voxel. The fiber tracking step utilizes an extended version of the “Fiber Assignment by Continuous Tracking” (FACT) algorithm :cite:`RN255`, which is a deterministic tracking algorithm that starts fiber reconstruction from seeds in the white matter and propagates streamlines in the main diffusion axis of the voxel while updating the propagation direction each time the tip of the streamline enters a new voxel. Fiber reconstruction starts from one or multiple seeds (number of seeds set by :term:`NumberOfSeedsPerVoxel`) in all voxels with a matching segmentation label as provided by :term:`startRegions`.

Fiber reconstruction stops if a tracker is 
	- in a region with fractional anisotropy lower than :term:`minFA`.
	- in a stopping region with segmentation code included in the :term:`stopRegions` variable
	- about to revisit the current voxel or previously visited voxel, 
	- about to enter a forbidden region with segmentation code included in the :term:`forbiddenRegions` variable
	- or about to make a sharp turn, i.e. an angle > :term:`maxAngleDeg`.

.. toggle-header::
    :header: **Show advanced notes**
    
		Both the :ref:`reconstruction_fibers` and the :ref:`reconstruction_network` step include parameters :term:`maxAngleDeg` and :term:`minFA`, but both parameters are specific for their reconstruction step. 

.. _reconstruction_fiber_properties:

Reconstruction fiber properties
------------------------------------------
The :ref:`reconstruction_fiber_properties <reconstruction_fiber_properties>` step identifies fiber segments that connect brain regions and calculates fiber measures as preparation for the network reconstruction step. For each atlas and reconstruction method, the :ref:`reconstruction_fiber_properties <reconstruction_fiber_properties>` step iterates through all fibers and if a fiber crosses two or more brain regions of interest, as defined by the regions of interest file (:term:`ROIsFile`), then the shortest fiber segment between each region pair is included in the fiber properties file (:term:`fiberPropertiesFile`). In addition to the start and end point of each fiber segment and the associated region pair, additional measures for fiber segments are stored, including:

	- maximum turn angle (in radials),
	- minimum fractional anisotropy
	- fiber length (physical length in mm),
	- average fractional anisotropy (FA),
	- axial diffusivity (AD),
	- radial diffusivity (RD),
	- mean diffusivity (MD) and
	- generalized fractional anisotropy (GFA)

Diffusion measures (FA, AD, RD, MD and GFA) are averaged over voxels weighted by the length of the traversed path through each voxel :cite:`RN678`.

.. _reconstruction_network:

Network reconstruction
-------------------------------
The :ref:`reconstruction_network <reconstruction_network>` step builds the connectivity matrices for each of the selected (sub)cortical atlases and reconstruction methods. Brain regions included in the connectivity matrix, and their order, are defined by the regions of interest file (:term:`ROIsFile`). The network matrix is constructed by iterating through all fiber segments in the :term:`fiberPropertiesFile` and fiber segments connecting regions of interest are added to the connectivity matrix. Fibers can additionally be filtered by their projection length (with only fibers longer than :term:`minLengthMM` being included in the network reconstruction), minimum fractional anisotropy (including only fibers that touch voxels with fractional anisotropy higher than :term:`minFA`)  and maximum angle (including only fibers that make turns in their trajectories smaller than :term:`maxAngleDeg`).

Connections are assigned weights by

	- the number of streamlines (i.e. the number of fibers) that connect two regions (NOS)
	- fiber length (physical length in mm)
	- fractional anisotropy (FA)
	- axial diffusivity (AD)
	- radial diffusivity (RD)
	- mean diffusivity (MD)
	- generalized fractional anisotropy (GFA)
	- streamline volume density (SVD, number of streamlines divided by the average volume of both regions) and
	- streamline surface density (SSD, number of streamlines divided by the average surface area of both regions) 

Diffusion measures (FA, AD, RD, MD and GFA) are averaged over voxels weighted by the length of the traversed path through each voxel :cite:`RN678`.