<template>
    <div>
        <input type="text"
            v-model="inputSecretPart"
            placeholder="Please input your secret parts"
            class="sectet-input">
        <button @click="addSecretPart"
            class="btn-add"
            :disabled="!inputSecretPart">Add</button>
        <button @click="recoverSecret"
            class="btn-recover">Recover</button>
        <p v-if="secretParts.length > 0">You have input {{ secretParts.length }} secret {{ secretParts.length > 1 ? 'parts': 'part'}}</p>
        <p v-if="showSign"
            class="secret-item"
            @click="copy(signature)"><b>Signature:</b><br><br> {{ signature }}</p>
        <button v-if="showSign"
            @click="dialogFormShow = true"
            class="btn-sign">Signature</button>

        <el-dialog title="Signature your data"
            width="640px"
            :visible.sync="dialogFormShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <sign-form @signData="sign"></sign-form>
        </el-dialog>
    </div>
</template>

<script>
    import Clipboard from 'clipboard'
    import ShamirSecret from '../shamir/index.js'
    import SignForm from '../components/SignForm'
    export default {
        name: 'recover',
        components: {
            SignForm
        },
        data() {
            return {
                inputSecretPart: '',
                secretObj: '',
                secretParts: [],
                signature: '',
                showSign: false,
                clipboardObj: '',

                dialogFormShow: false
            }
        },
        methods: {
            // 保存输入结果到数组中
            addSecretPart() {
                if (!this.inputSecretPart) return
                this.secretObj.input(this.inputSecretPart)
                this.secretParts.push(this.inputSecretPart)
                this.inputSecretPart = ''
                this.showSign = false
            },
            // 恢复私钥
            async recoverSecret() {
                try {
                    this.signature = await this.secretObj.recover()
                    this.showSign = true
                    this.secretParts = []
                    this.secretObj.inputParts = []
                } catch (e) {
                    console.log(e)
                    this.$message({message: 'Invalid or not enough keys', type: 'error'});
                    this.secretParts = []
                    this.secretObj.inputParts = []
                }
            },
            // 利用私钥进行签名
            sign(data) {
                console.log(data)
                try {
                    window.sign(data)
                    this.dialogFormShow = false
                } catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    })
                }
            },
            // 复制
            copy(text) {
                this.clipboardObj = new Clipboard('.secret-item', {
                    text: () => text
                });
                this.clipboardObj.on('success', () => {
                    this.$message({message: 'Copied', type: 'success'});
                })
            },
        },
        mounted() {
            this.secretObj = new ShamirSecret()
        }
    }
</script>

<style scoped>
    .sectet-input {
        width: 360px;
    }
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
    .btn-recover {
        background-color: #67c23a;
    }
    .btn-recover:hover {
        background-color: rgb(80, 153, 43);
    }
    .btn-add {
        background-color: #409eff;
    }
    .btn-add:hover {
        background-color: rgb(51, 129, 206);
    }
    .btn-sign {
        background-color: #e6a23c;
    }
    .btn-sign:hover {
        background-color: rgb(190, 130, 39);
    }
</style>

