import { each, find, without } from 'lodash';
import Vue from 'vue';
import NProgress from 'nprogress';

import http from '../services/http';
import stub from '../stubs/file';

export default {
    state: {
        path: [],
        selected: false,
        files: false,
        fileToCopy: false,
        currentLocation: null
    },

    /**
     * Init the store.
     *
     * @param {Object}          selectedFile The selected file.
     */
     init(selectedFile, path) {
        this.selected = selectedFile;
        this.path = path;
        this.state.currentLocation = path;
    },

    /**
     * The selected file.
     *
     * @return {Object}
     */
     get selected() {
        return this.state.selected;
    },

    /**
     * Set the selected file.
     *
     * @param  {Object} file
     *
     * @return {Object}
     */
     set selected(file) {
        this.state.selected = file;

        return this.selected;
    },

    /**
     * The Current Location.
     *
     * @return {Object}
     */
     get currentLocation() {
        return this.state.currentLocation;
    },

    /**
     * Set the Current Location.
     *
     * @param  {Object} file
     *
     * @return {Object}
     */
     set currentLocation(file) {
        this.state.currentLocation = file;

        return this.currentLocation;
    },
    /**
     * The fileToCopy file.
     *
     * @return {Object}
     */
     get fileToCopy() {
        return this.state.fileToCopy;
    },

    /**
     * Set the fileToCopy file.
     *
     * @param  {Object} file
     *
     * @return {Object}
     */
     set fileToCopy(file) {
        this.state.fileToCopy = file;

        return this.fileToCopy;
    },

    /**
     * The selected path
     *
     * @return {Object}
     */
     get path() {
        return this.state.path;
    },

    /**
     * Set the selected path
     *
     * @param  {Array} path
     *
     * @return {Object}
     */
     set path(path) {
        this.state.path = path;

        return this.path;
    },

    /**
     * The files
     *
     * @return {Object}
     */
     get files() {
        return this.state.files;
    },

    /**
     * Set the files
     *
     * @param  {Array} files
     *
     * @return {Object}
     */
     set files(files) {
        this.state.files = files;

        return this.files;
    },

    /**
     * Browse
     */
     browse(account, path = null, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/browse";
        let data = path === null ? {} : { path };
        http.get(url, data, response => {
            const data = response.data;
            const files = data.data;

            this.state.currentLocation = path;
            this.state.files = files;

            if (successCb) {
                successCb(files);
            }
        }, errorCb);
    },

    /**
     * Rename File
     * @param  {int} account   Account ID
     * @param  {string} file      Selected File ID
     * @param  {string} title     New File Title
     * @param  {?Function} successCb
     * @param  {?Function} errorCb
     * @return {Promise}
     */
     rename(account, file, title, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/rename";
        let data = { file, title };

        return http.patch(url, data, response => {
            const data = response.data;
            const newFile = data.data;

            if (successCb) {
                successCb(newFile);
            }
        }, errorCb);

    },

    /**
     * Delete File
     * @param  {int} account   Account ID
     * @param  {string} file   Selected File ID
     * @param  {?Function} successCb
     * @param  {?Function} errorCb
     * @return {Promise}
     */
     delete(account, file, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/delete";
        let data = { file };

        return http.delete(url, data, response => {
            //Remove file from the store
            this.files.$remove(this.selected);

            if (successCb) {
                successCb();
            }
        }, errorCb);

    },

    /**
     * Download File
     * @param  {int} account   Account ID
     * @param  {string} file   Selected File ID
     * @param  {?Function} successCb
     * @param  {?Function} errorCb
     * @return {Promise}
     */
     download(account, file, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/download";
        let data = { file };

        return http.get(url, data,
            response => {
                const data = response.data;
                const link = data.link;

                if (successCb) {
                    successCb(link);
                }
            },

            response => {
                const data = response.data;
                const error = data.error;

                if (errorCb) {
                    errorCb(error);
                }
            }
        );

    },

    /**
     * Get Sharing Link
     * @param  {int} account   Account ID
     * @param  {string} file      File ID
     * @param  {?Function} successCb
     * @param  {?Function} errorCb
     * @return {Promise}
     */
    getShareLink(account, file, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/share-link";
        let data = { file };

        return http.get(url, data,
            response => {
                const data = response.data;
                const link = data.link;

                if (successCb) {
                    successCb(link);
                }
            },

            response => {
                const data = response.data;
                const error = data.error;

                if (errorCb) {
                    errorCb(error);
                }
            }
        );
    },

    /**
     * Copy File
     */
     copy(account, file, location = null, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/copy";
        let data = { file };

        if(location !== null) {
            data.location = location;
        }

        return http.post(url, data, response => {
            const data = response.data;
            const file = data.data;

            //Reset fileToCopy
            this.fileToCopy = false;

            //If the currentLocation is where the file was copied
            if(this.currentLocation === location)
            {
                //If File List if empty, initialize it
                if(!this.files) {
                    this.files = [];
                }

                //Add File to the List
                this.files.unshift(file);

                //Select the File
                this.selected = file;
            }

            if (successCb) {
                successCb(file);
            }
        }, errorCb);
    },

    /**
     * Create Folder
     */
     createFolder(account, title, location = null, successCb = null, errorCb = null) {
        NProgress.start();
        let url = "accounts/" + account + "/manager/create-folder";
        let data = { title };

        if(location !== null) {
            data.location = location;
        }

        return http.post(url, data, response => {
            const data = response.data;
            const folder = data.data;

            //If the currentLocation is where the folder was created
            if(this.currentLocation === location)
            {
                //If File List if empty, initialize it
                if(!this.files) {
                    this.files = [];
                }

                //Add Folder to the List
                this.files.unshift(folder);

                //Select the Folder
                this.selected = folder;
            }

            if (successCb) {
                successCb(folder);
            }
        }, errorCb);
    },

};