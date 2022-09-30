.. role:: button
   :class: btn btn-outline-primary

Getting started 
=================
Read :ref:`how to use the CATO toolbox <usage>`.

.. _usage:

How to use CATO
------------------------------
After :ref:`installation <installation>`, the structural and functional pipelines can be run from the command line (as executable) or in MATLAB (as MATLAB Toolbox). The executable is fast and easy to deploy on high-performance computing clusters and the set of MATLAB functions is easy to customize. 

.. content-tabs::

    .. tab-container:: tab1
        :title: Executable

        .. code-block::

            structural_pipeline  -s SUBJECTDIR  -m MCRDIR [--PARAM1=VAL1]  [--PARAM2=VAL2]...
            functional_pipeline  -s SUBJECTDIR  -m MCRDIR [--PARAM1=VAL1]  [--PARAM2=VAL2]...

        To run specific pipeline steps, include the requested pipeline steps as first input arguments:: 

            structural_pipeline  [STEP]... -s SUBJECTDIR  -m MCRDIR [--PARAM1=VAL1]  [--PARAM2=VAL2]...
            functional_pipeline  [STEP]... -s SUBJECTDIR  -m MCRDIR [--PARAM1=VAL1]  [--PARAM2=VAL2]...

    .. tab-container:: tab2
        :title: MATLAB

        .. code-block::

            structural_pipeline(SUBJECTDIR, 'PARAM1', VAL1, 'PARAM2', VAL2, ...)
            functional_pipeline(SUBJECTDIR, 'PARAM1', VAL1, 'PARAM2', VAL2, ...)

With the following parameters:

.. glossary::
    SUBJECTDIR
            :example: ``/Volumes/DATA/subject001``
            :description: Directory with the subject's FreeSurfer, rs-fMRI and/or DWI data.

    MCRDIR
            :example: ``/Applications/MATLAB/MATLAB_Runtime/v93``
            :description: Installation directory of :ref:`MATLAB runtime version R2017b (9.3) <MATLAB Compiler Runtime>`. 

    STEP
            :example: ``structural_preprocessing``
            :description: Specific pipeline steps that will be executed.

    PARAM1 VAL1 name-value pair arguments
            :terminal: ``--general.freesurferDir='T1/SUBJECT_FS'``
            :MATLAB: ``'general.freesurferDir', 'T1/SUBJECT_FS'``
            :description: Configuration parameters that overwrite the default values and values specified in the configuration file.

Running a subject again
------------------------------
At default, the pipelines gives an error when it notices that a subject has already been (partly) processed. Use the ``runType`` parameter to determine the behavior when re-running a subject:

.. content-tabs::

    .. tab-container:: tab1
        :title: Executable

        .. code-block::

            structural_pipeline -s SUBJECTDIR -m MCRDIR --runType=overwrite

    .. tab-container:: tab2
        :title: MATLAB

        .. code-block::

            structural_pipeline(SUBJECTDIR, 'runType', 'overwrite');

.. list-table::
    :align: left
    :widths: 20 80
    :header-rows: 1

    *   - Parameter value
        - Description
    *   - ``none``
        - (Default) Execute pipeline only when no :term:`logFile` is present in the output directory.
    *   - ``continue``
        - Execute steps that have not been started earlier or halted due to an error. Does not execute steps that finished successfully.
    *   - ``overwrite``
        - Execute all steps including steps that finished successfully earlier.

Parameters
---------------
Reconstruction parameters for the structural and functional pipeline can be specified on the command line or in a configuration file in JSON-format. Parameters in the user-provided configuration file overwrite the default parameters and parameters specified on the command line overwrite both. The user can use parameters in their configuration file or on the command line that are not defined in CATO. This will throw a warning, but this warning can be ignored.

Special variables
###############
Special variables can be used in the configuration file to create dynamic parameter values. Special variables are always in capitals and two special variables must be seperated by a character  (e.g. 'a', '0' or '_') that is not a capital letter.


Examples of other special variables:
    1. The name of a parameter in capitals (e.g. MINFA, DWIFILE or OUTPUTDIR). This special variable will be replaced with the value of the parameter referenced. The following example shows how MINFA and OUTPUTDIR are used as special variables, resulting in a reconstructed fiber cloud file named `DWI_processed/fibers_0.1.trk`:

    ``
        "reconstruction_fibers":{
            "minFA": 0.1,       
            "fiberFile": "OUTPUTDIR/fibers_MINFA.trk"      
        }
    ``

    2. SUBJECT: the subject name (the name of the directory with the data).
    3. TOOLBOXDIR: the location of the toolbox directory.
    4. CONFIGDIR: the location of the directory containing the configuration file.
    5. METHOD: the used reconstruction method, e.g. 'csd'. (only in structural pipeline).
    6. TEMPLATE: the used template, e.g. 'lausanne120'.
    7. MEASURE: the used diffusion measure, e.g. 'fractional anisotropy' (only when exporting diffusion measures to NifTi in the :ref`reconstruction_diffusion` step).
