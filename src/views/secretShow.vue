<template>
    <div>
        <div class="number-input__wrap">
            <input type="number"
            max="10"
            min="2"
		    v-model="totalShares"
		    placeholder="Total parts"
		    class="number-input">
            <input type="number"
            max="10"
            min="2"
		    v-model="requiredShares"
		    placeholder="Required parts"
		    class="number-input">
        </div>
            <button @click='createAccount'
                class="btn-create"
                v-if="hasAccount">Create Account</button>
            <button @click='showSecret'
                :disabled="btnDisable"
                class="btn-show"
                v-else>Show</button>

            <p v-show="address">Address: {{ address }}</p>
            <p class="secret-order" v-if="secretParts.length">{{ totalShares }} - {{ order }}</p>
            <div v-for="(item,index) in secretParts"
                :key="index"
                class="secret-item"
                title="click to copy"
                @click="copy(item)">{{ item }}</div>
        </div>
</template>

<script>
    import ShamirSecret from '../shamir/index.js'
    import Clipboard from 'clipboard'

    export default {
        name: 'HelloWorld',
        data() {
            return {
                address: '',
                hash: {},
                secretShow: {},
                secretParts: [],
                totalShares: 5,
                requiredShares: 4,
                btnDisable: false,
                hasAccount: true,
                clipboardObj: null,
                order: 0
            }
        },
        methods: {
            /**
             * 调用遍历器对象的next方法，每次得到一份分割好的私钥显示出来
             * 遍历完成后来，按钮不可点击
             */
            showSecret() {
                const part = this.secretShow.next()
                if (part.done) {
                    this.copy(' ')
                    this.$message({
                        message: 'No more keys',
                        type: 'error'
                    })
                    this.btnDisable = true
                    return
                }
                this.secretParts.shift()
                this.secretParts.push(part.value)
                this.copy(part.value)
                this.order ++ 
                console.log(part)
            },
            /**
             * 创建以太坊账号，生成5份私钥
             * 同时将保存生成器函数的引用
             */
            createAccount() {
                let totalShares = parseInt(this.totalShares)
                let requiredShares = parseInt(this.requiredShares)
                if (totalShares > 10 || requiredShares > 10) {
                    this.$message({message: 'Number you input must be between 2 - 10', type: 'error'});
                    return 
                }
                if (requiredShares < 2) {
                    this.$message({message: 'Number you input must be between 2 - 10', type: 'error'});
                    return 
                }
                if (requiredShares > totalShares) {
                    this.$message({message: 'Threshold must be less than the number of sharesNum', type: 'error'});
                    return 
                }
                const secret = new ShamirSecret()
                this.hasAccount = false
                this.secretShow = secret.show()
                const res = secret.create(totalShares, requiredShares)
                console.log(res)
                if (res) {
                    this.address = res.address
                }
            },
            // 复制
            copy(item) {
                this.clipboardObj = new Clipboard('.btn-show', {
                    text: () => item
                });
                this.clipboardObj.on('success', () => {
                    this.$message({message: 'Copied', type: 'success'});
                })
            },
        },
        destroyed() {
            if (this.clipboardObj) {
                this.clipboardObj.destroy()
            }
        }
    }
</script>

<style scoped>
    .secret-item {
        margin: 20px auto;
        max-width: 600px;
        word-wrap: break-word;
        text-align: left;
        cursor: pointer;
        border: 1px solid #eee;
        padding: 20px;
        transition: 0.3s;
    }
    .secret-item:hover {
        background: #f2f2f2;
    }
    .btn-create {
        width: 200px;
        background-color: #67c23a;
    }
    .btn-create:hover {
        background-color: rgb(80, 153, 43);
    }
    .btn-show {
        background-color: #409eff;
    }
    .btn-show:hover {
        background-color: rgb(51, 129, 206);
    }
    .number-input__wrap {
        margin: 20px auto;
    }
    .number-input {
        width: 200px;
        display: block;
        margin: 10px auto;
    }
    .secret-order {
        text-align: left;
        width: 600px;
        margin: 0 auto;
    }
</style>
