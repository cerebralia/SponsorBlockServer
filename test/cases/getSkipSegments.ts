import fetch from 'node-fetch';
import {db} from '../../src/databases/databases';
import {Done, getbaseURL} from '../utils';
import {getHash} from '../../src/utils/getHash';

describe('getSkipSegments', () => {
    before(() => {
        let startOfQuery = "INSERT INTO sponsorTimes (videoID, startTime, endTime, votes, UUID, userID, timeSubmitted, views, category, shadowHidden, hashedVideoID) VALUES";
        db.exec(startOfQuery + "('testtesttest', 1, 11, 2, '1-uuid-0', 'testman', 0, 50, 'sponsor', 0, '" + getHash('testtesttest', 1) + "')");
        db.exec(startOfQuery + "('testtesttest', 20, 33, 2, '1-uuid-2', 'testman', 0, 50, 'intro', 0, '" + getHash('testtesttest', 1) + "')");
        db.exec(startOfQuery + "('testtesttest,test', 1, 11, 2, '1-uuid-1', 'testman', 0, 50, 'sponsor', 0, '" + getHash('testtesttest,test', 1) + "')");
        db.exec(startOfQuery + "('test3', 1, 11, 2, '1-uuid-4', 'testman', 0, 50, 'sponsor', 0, '" + getHash('test3', 1) + "')");
        db.exec(startOfQuery + "('test3', 7, 22, -3, '1-uuid-5', 'testman', 0, 50, 'sponsor', 0, '" + getHash('test3', 1) + "')");
        db.exec(startOfQuery + "('multiple', 1, 11, 2, '1-uuid-6', 'testman', 0, 50, 'intro', 0, '" + getHash('multiple', 1) + "')");
        db.exec(startOfQuery + "('multiple', 20, 33, 2, '1-uuid-7', 'testman', 0, 50, 'intro', 0, '" + getHash('multiple', 1) + "')");
    });


    it('Should be able to get a time by category 1', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest&category=sponsor")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const data = await res.json();
                if (data.length === 1 && data[0].segment[0] === 1 && data[0].segment[1] === 11
                    && data[0].category === "sponsor" && data[0].UUID === "1-uuid-0") {
                    done();
                } else {
                    done("Received incorrect body: " + (await res.text()));
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Should be able to get a time by category 2', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest&category=intro")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const data = await res.json();
                if (data.length === 1 && data[0].segment[0] === 20 && data[0].segment[1] === 33
                    && data[0].category === "intro" && data[0].UUID === "1-uuid-2") {
                    done();
                } else {
                    done("Received incorrect body: " + (await res.text()));
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Should be able to get a time by categories array', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest&categories=[\"sponsor\"]")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const data = await res.json();
                if (data.length === 1 && data[0].segment[0] === 1 && data[0].segment[1] === 11
                    && data[0].category === "sponsor" && data[0].UUID === "1-uuid-0") {
                    done();
                } else {
                    done("Received incorrect body: " + (await res.text()));
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Should be able to get a time by categories array 2', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest&categories=[\"intro\"]")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const data = await res.json();
                if (data.length === 1 && data[0].segment[0] === 20 && data[0].segment[1] === 33
                    && data[0].category === "intro" && data[0].UUID === "1-uuid-2") {
                    done();
                } else {
                    done("Received incorrect body: " + (await res.text()));
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Should be able to get multiple times by category', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=multiple&categories=[\"intro\"]")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const body = await res.text();
                const data = JSON.parse(body);
                if (data.length === 2) {
                    let success = true;
                    for (const segment of data) {
                        if ((segment.segment[0] !== 20 || segment.segment[1] !== 33
                            || segment.category !== "intro" || segment.UUID !== "1-uuid-7") &&
                            (segment.segment[0] !== 1 || segment.segment[1] !== 11
                                || segment.category !== "intro" || segment.UUID !== "1-uuid-6")) {
                            success = false;
                            break;
                        }
                    }

                    if (success) done();
                    else done("Received incorrect body: " + body);
                } else {
                    done("Received incorrect body: " + body);
                }
            }
        })
        .catch(err => done("Couldn't call endpoint\n\n" + err));
    });

    it('Should be able to get multiple times by multiple categories', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest&categories=[\"sponsor\", \"intro\"]")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const body = await res.text();
                const data = JSON.parse(body);
                if (data.length === 2) {

                    let success = true;
                    for (const segment of data) {
                        if ((segment.segment[0] !== 20 || segment.segment[1] !== 33
                            || segment.category !== "intro" || segment.UUID !== "1-uuid-2") &&
                            (segment.segment[0] !== 1 || segment.segment[1] !== 11
                                || segment.category !== "sponsor" || segment.UUID !== "1-uuid-0")) {
                            success = false;
                            break;
                        }
                    }

                    if (success) done();
                    else done("Received incorrect body: " + body);
                } else {
                    done("Received incorrect body: " + body);
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Should be possible to send unexpected query parameters', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest&fakeparam=hello&category=sponsor")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const body = await res.text();
                const data = JSON.parse(body);
                if (data.length === 1 && data[0].segment[0] === 1 && data[0].segment[1] === 11
                    && data[0].category === "sponsor" && data[0].UUID === "1-uuid-0") {
                    done();
                } else {
                    done("Received incorrect body: " + body);
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Low voted submissions should be hidden', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=test3&category=sponsor")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const body = await res.text();
                const data = JSON.parse(body);
                if (data.length === 1 && data[0].segment[0] === 1 && data[0].segment[1] === 11
                    && data[0].category === "sponsor" && data[0].UUID === "1-uuid-4") {
                    done();
                } else {
                    done("Received incorrect body: " + body);
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

    it('Should return 404 if no segment found', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=notarealvideo")
        .then(res => {
            if (res.status !== 404) done("non 404 respone code: " + res.status);
            else done(); // pass
        })
        .catch(err => done("couldn't call endpoint"));
    });


    it('Should be able send a comma in a query param', (done: Done) => {
        fetch(getbaseURL() + "/api/skipSegments?videoID=testtesttest,test&category=sponsor")
        .then(async res => {
            if (res.status !== 200) done("Status code was: " + res.status);
            else {
                const body = await res.text();
                const data = JSON.parse(body);
                if (data.length === 1 && data[0].segment[0] === 1 && data[0].segment[1] === 11
                    && data[0].category === "sponsor" && data[0].UUID === "1-uuid-1") {
                    done();
                } else {
                    done("Received incorrect body: " + body);
                }
            }
        })
        .catch(err => done("Couldn't call endpoint"));
    });

});
