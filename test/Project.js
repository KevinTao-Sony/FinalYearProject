const Project = artifacts.require('./Project.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Project', ([deployer, author]) => {
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
            result = await project.createPost('test', { from: author })
            postCount = await project.postCount()
        })

        it('creates a post', async () => {
            //success
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'test', 'content is correct')
            //assert.equal(event.title, 'title', 'title is correct')
            assert.equal(event.author, author, 'author is correct')
            //content must not be empty
            await project.createPost('', { from: author }).should.be.rejected
        })
        it('list post', async () => {
            const post = await project.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'test', 'content is correct')
            assert.equal(post.author, author, 'author is correct')
        })
    })
    describe('documents', async () => {
        let result, docCount

        before(async () => {
            result = await project.uploadDoc('0xffff', 'doc1', { from: author })
            docCount = await project.docCount()
        })

        it('creates a document', async () => {
            //success
            assert.equal(docCount, 1)
            const event = result.logs[0].args
            assert.equal(event.doc_id.toNumber(), docCount.toNumber(), 'id is correct')
            assert.equal(event.content, '0xffff', 'content is correct')
            assert.equal(event.title, 'doc1', 'title is correct')
            assert.equal(event.author, author, 'author is correct')
            //content must not be empty
            await project.createPost('', { from: author }).should.be.rejected
        })
        it('list document', async () => {
            const doc = await project.docs(docCount)
            assert.equal(doc.id.toNumber(), docCount.toNumber(), 'id is correct')
            assert.equal(doc.content, '0xffff', 'content is correct')
            assert.equal(doc.author, author, 'author is correct')
        })
    })
})

