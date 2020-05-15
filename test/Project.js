const Project = artifacts.require('./Project.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Project', (author) => {
    let project

    before(async () => {
        project = await Project.deployed()
    })
    describe('deployment', async () => {

        it('deploys successfully', async () => {
            const address = await project.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await project.name()
            assert.equal(name, 'project')
             
        })
    })

    describe('posts', async () => {
        let result, postCount
        
        before(async () => {
            result = await project.createPost('test', { from: author[0] })
            postCount = await project.postCount()
        })

        it('creates a post', async () => {
            //success
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'test', 'content is correct')
            assert.equal(event.author, author[0], 'author is correct')
            //content must not be empty
            await project.createPost('', { from: author[0] }).should.be.rejected
        })
        it('list post', async () => {
            const post = await project.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'test', 'content is correct')
            assert.equal(post.author, author[0], 'author is correct')
        })
    })
    describe('create and delete documents', async () => {
        let result, docCount

        before(async () => {
            result = await project.uploadDoc('0xffff', 'doc1', { from: author[0] })
            docCount = await project.docCount()
        })

        it('creates a document', async () => {
            //success
            assert.equal(docCount, 1)
            const event = result.logs[0].args
            assert.equal(event.doc_id.toNumber(), docCount.toNumber(), 'id is correct')
            assert.equal(event.content, '0xffff', 'content is correct')
            assert.equal(event.title, 'doc1', 'title is correct')
            assert.equal(event.author, author[0], 'author is correct')
            //content must not be empty
            await project.createPost('', { from: author[0] }).should.be.rejected
        })
        it('delete document', async () => {
            const doc = await project.deleteDoc(docCount)
            const event = result.logs[0].args
            assert.equal(event.doc_id.toNumber(), docCount.toNumber(), 'id is correct')

        })
    })
    describe('Update documents', async () => {
        let result, docCount, result_get

        before(async () => {
            result = await project.uploadDoc('0xffff', 'doc1', { from: author[0] })
            docCount = await project.docCount()
            result_get = await project.updateDoc(docCount, "0xas", "doc1", { from: author[0] })
        })

        it('changes a document', async () => {
            //success
            assert.equal(docCount, 2)
            const event = result_get.logs[0].args
            assert.equal(event.doc_id.toNumber(), docCount.toNumber(), 'id is correct')
            assert.equal(event.content, '0xas', 'content is correct')
            assert.equal(event.title, 'doc1', 'title is correct')
            assert.equal(event.author, author[0], 'author is correct')
            //content must not be empty

        })
    })

})

