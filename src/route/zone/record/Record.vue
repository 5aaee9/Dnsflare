<template>
    <el-dialog
        :title="`${modeLocale} Record`"
        :model-value="dialogVisible"
        width="unset"
        style="max-width: 1140px"
        @update:model-value="handleClose"
    >
        <div>
            <el-form ref="ruleFormRef" label-width="120px" :model="model" :rules="validationRules">
                <el-form-item prop="name">
                    <template #label>
                        <span> <FontAwesomeIcon icon="file" /> 名称 </span>
                    </template>
                    <el-input v-model="model.name" />
                </el-form-item>
                <el-form-item v-if="!hasStructuredForm" prop="content">
                    <template #label>
                        <span> <FontAwesomeIcon icon="font" /> 目标 </span>
                    </template>
                    <el-input v-model="model.content" />
                </el-form-item>
                <el-form-item v-if="isCAA" prop="data.flags">
                    <template #label>
                        <span> <FontAwesomeIcon icon="flag" /> Flags </span>
                    </template>
                    <el-input-number v-model="model.data.flags" :min="0" :max="255" />
                </el-form-item>
                <el-form-item v-if="isCAA" prop="data.tag">
                    <template #label>
                        <span> <FontAwesomeIcon icon="tag" /> Tag </span>
                    </template>
                    <el-select
                        v-model="model.data.tag"
                        allow-create
                        filterable
                        placeholder="选择或输入"
                    >
                        <el-option label="issue" value="issue" />
                        <el-option label="issuewild" value="issuewild" />
                        <el-option label="iodef" value="iodef" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isCAA" prop="data.value">
                    <template #label>
                        <span> <FontAwesomeIcon icon="font" /> Value </span>
                    </template>
                    <el-input v-model="model.data.value" />
                </el-form-item>
                <el-form-item v-if="requirePriority" prop="priority">
                    <template #label>
                        <span> <FontAwesomeIcon icon="sort-numeric-up" /> 优先级 </span>
                    </template>
                    <el-input-number v-model="model.priority" />
                </el-form-item>
                <el-form-item v-if="isSRV" prop="weight">
                    <template #label>
                        <span> <FontAwesomeIcon icon="sort-numeric-up" /> 权重 </span>
                    </template>
                    <el-input-number v-model="model.data.weight" />
                </el-form-item>
                <el-form-item v-if="isSRV" prop="port">
                    <template #label>
                        <span> <FontAwesomeIcon icon="sort-numeric-up" /> 端口 </span>
                    </template>
                    <el-input-number v-model="model.data.port" />
                </el-form-item>
                <el-form-item v-if="isSRV" prop="target">
                    <template #label>
                        <span> <FontAwesomeIcon icon="font" /> 目标 </span>
                    </template>
                    <el-input v-model="model.data.target" />
                </el-form-item>
                <el-form-item v-if="isHTTPSSVCB" prop="data.target">
                    <template #label>
                        <span> <FontAwesomeIcon icon="font" /> 目标 </span>
                    </template>
                    <el-input
                        v-model="model.data.target"
                        placeholder='例如: "." 或 "example.com"'
                    />
                </el-form-item>
                <el-form-item v-if="isHTTPSSVCB" prop="data.value">
                    <template #label>
                        <span> <FontAwesomeIcon icon="font" /> 参数 </span>
                    </template>
                    <el-input v-model="model.data.value" placeholder="例如: alpn=h2,h3" />
                </el-form-item>
                <el-form-item v-if="isDS" prop="data.keyTag">
                    <template #label>
                        <span> <FontAwesomeIcon icon="key" /> Key Tag </span>
                    </template>
                    <el-input-number
                        v-model="model.data.keyTag"
                        :min="0"
                        :max="65535"
                        placeholder="DNSKEY 记录的 Key Tag"
                    />
                </el-form-item>
                <el-form-item v-if="isDS" prop="data.algorithm">
                    <template #label>
                        <span> <FontAwesomeIcon icon="cog" /> 签名算法 </span>
                    </template>
                    <el-select v-model="model.data.algorithm" placeholder="选择算法">
                        <el-option label="8 - RSA/SHA-256" :value="8" />
                        <el-option label="10 - RSA/SHA-512" :value="10" />
                        <el-option label="13 - ECDSAP256SHA256" :value="13" />
                        <el-option label="14 - ECDSAP384SHA384" :value="14" />
                        <el-option label="15 - Ed25519" :value="15" />
                        <el-option label="16 - Ed448" :value="16" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isDS" prop="data.digestType">
                    <template #label>
                        <span> <FontAwesomeIcon icon="fingerprint" /> 摘要算法 </span>
                    </template>
                    <el-select v-model="model.data.digestType" placeholder="选择摘要算法">
                        <el-option label="1 - SHA-1 (不推荐)" :value="1" />
                        <el-option label="2 - SHA-256 (推荐)" :value="2" />
                        <el-option label="4 - SHA-384" :value="4" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isDS" prop="data.digest">
                    <template #label>
                        <span> <FontAwesomeIcon icon="font" /> 摘要 </span>
                    </template>
                    <el-input v-model="model.data.digest" placeholder="十六进制摘要值" />
                </el-form-item>

                <!-- DNSKEY fields -->
                <el-form-item v-if="isDNSKEY" prop="data.flags">
                    <template #label
                        ><span><FontAwesomeIcon icon="flag" /> Flags</span></template
                    >
                    <el-select v-model="model.data.flags" placeholder="选择">
                        <el-option label="256 - ZSK (区域签名密钥)" :value="256" />
                        <el-option label="257 - KSK (密钥签名密钥)" :value="257" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isDNSKEY">
                    <template #label
                        ><span><FontAwesomeIcon icon="cog" /> Protocol</span></template
                    >
                    <el-input :model-value="3" disabled />
                </el-form-item>
                <el-form-item v-if="isDNSKEY" prop="data.algorithm">
                    <template #label
                        ><span><FontAwesomeIcon icon="cog" /> 签名算法</span></template
                    >
                    <el-select v-model="model.data.algorithm" placeholder="选择算法">
                        <el-option label="8 - RSA/SHA-256" :value="8" />
                        <el-option label="10 - RSA/SHA-512" :value="10" />
                        <el-option label="13 - ECDSAP256SHA256" :value="13" />
                        <el-option label="14 - ECDSAP384SHA384" :value="14" />
                        <el-option label="15 - Ed25519" :value="15" />
                        <el-option label="16 - Ed448" :value="16" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isDNSKEY" prop="data.publicKey">
                    <template #label
                        ><span><FontAwesomeIcon icon="key" /> 公钥</span></template
                    >
                    <el-input
                        v-model="model.data.publicKey"
                        type="textarea"
                        :rows="2"
                        placeholder="Base64 编码的公钥"
                    />
                </el-form-item>

                <!-- CERT fields -->
                <el-form-item v-if="isCERT" prop="data.type">
                    <template #label
                        ><span><FontAwesomeIcon icon="file" /> Type</span></template
                    >
                    <el-select v-model="model.data.type" placeholder="选择">
                        <el-option label="1 - PKIX" :value="1" />
                        <el-option label="2 - SPKI" :value="2" />
                        <el-option label="3 - PGP" :value="3" />
                        <el-option label="4 - IPKIX" :value="4" />
                        <el-option label="5 - ISPKI" :value="5" />
                        <el-option label="6 - URI" :value="6" />
                        <el-option label="254 - OID" :value="254" />
                        <el-option label="255 - Private" :value="255" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isCERT" prop="data.keyTag">
                    <template #label
                        ><span><FontAwesomeIcon icon="key" /> Key Tag</span></template
                    >
                    <el-input-number v-model="model.data.keyTag" :min="0" :max="65535" />
                </el-form-item>
                <el-form-item v-if="isCERT" prop="data.algorithm">
                    <template #label
                        ><span><FontAwesomeIcon icon="cog" /> 签名算法</span></template
                    >
                    <el-select v-model="model.data.algorithm" placeholder="选择算法">
                        <el-option label="8 - RSA/SHA-256" :value="8" />
                        <el-option label="10 - RSA/SHA-512" :value="10" />
                        <el-option label="13 - ECDSAP256SHA256" :value="13" />
                        <el-option label="14 - ECDSAP384SHA384" :value="14" />
                        <el-option label="15 - Ed25519" :value="15" />
                        <el-option label="16 - Ed448" :value="16" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isCERT" prop="data.certificate">
                    <template #label
                        ><span><FontAwesomeIcon icon="file" /> 证书</span></template
                    >
                    <el-input
                        v-model="model.data.certificate"
                        type="textarea"
                        :rows="2"
                        placeholder="证书内容"
                    />
                </el-form-item>

                <!-- SSHFP fields -->
                <el-form-item v-if="isSSHFP" prop="data.algorithm">
                    <template #label
                        ><span><FontAwesomeIcon icon="cog" /> 算法</span></template
                    >
                    <el-select v-model="model.data.algorithm" placeholder="选择算法">
                        <el-option label="1 - RSA" :value="1" />
                        <el-option label="2 - DSA" :value="2" />
                        <el-option label="3 - ECDSA" :value="3" />
                        <el-option label="4 - Ed25519" :value="4" />
                        <el-option label="6 - Ed448" :value="6" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isSSHFP" prop="data.type">
                    <template #label
                        ><span><FontAwesomeIcon icon="file" /> 类型</span></template
                    >
                    <el-select v-model="model.data.type" placeholder="选择">
                        <el-option label="1 - SHA-1 (不推荐)" :value="1" />
                        <el-option label="2 - SHA-256" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isSSHFP" prop="data.fingerprint">
                    <template #label
                        ><span><FontAwesomeIcon icon="fingerprint" /> 指纹</span></template
                    >
                    <el-input v-model="model.data.fingerprint" placeholder="十六进制指纹" />
                </el-form-item>

                <!-- TLSA / SMIMEA fields -->
                <el-form-item v-if="isTLSAorSMIMEA" prop="data.usage">
                    <template #label
                        ><span><FontAwesomeIcon icon="flag" /> Usage</span></template
                    >
                    <el-select v-model="model.data.usage" placeholder="选择">
                        <el-option label="0 - PKIX-TA" :value="0" />
                        <el-option label="1 - PKIX-EE" :value="1" />
                        <el-option label="2 - DANE-TA" :value="2" />
                        <el-option label="3 - DANE-EE" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isTLSAorSMIMEA" prop="data.selector">
                    <template #label
                        ><span><FontAwesomeIcon icon="file" /> Selector</span></template
                    >
                    <el-select v-model="model.data.selector" placeholder="选择">
                        <el-option label="0 - Full certificate" :value="0" />
                        <el-option label="1 - Subject public key" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isTLSAorSMIMEA" prop="data.matchingType">
                    <template #label
                        ><span><FontAwesomeIcon icon="fingerprint" /> Matching Type</span></template
                    >
                    <el-select v-model="model.data.matchingType" placeholder="选择">
                        <el-option label="0 - Full" :value="0" />
                        <el-option label="1 - SHA-256" :value="1" />
                        <el-option label="2 - SHA-512" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isTLSAorSMIMEA" prop="data.certificate">
                    <template #label
                        ><span><FontAwesomeIcon icon="file" /> 证书/公钥</span></template
                    >
                    <el-input
                        v-model="model.data.certificate"
                        type="textarea"
                        :rows="2"
                        placeholder="证书或公钥内容"
                    />
                </el-form-item>

                <!-- NAPTR fields -->
                <el-form-item v-if="isNAPTR" prop="data.order">
                    <template #label
                        ><span><FontAwesomeIcon icon="sort-numeric-up" /> Order</span></template
                    >
                    <el-input-number v-model="model.data.order" :min="0" :max="65535" />
                </el-form-item>
                <el-form-item v-if="isNAPTR" prop="data.preference">
                    <template #label
                        ><span
                            ><FontAwesomeIcon icon="sort-numeric-up" /> Preference</span
                        ></template
                    >
                    <el-input-number v-model="model.data.preference" :min="0" :max="65535" />
                </el-form-item>
                <el-form-item v-if="isNAPTR" prop="data.flags">
                    <template #label
                        ><span><FontAwesomeIcon icon="flag" /> Flags</span></template
                    >
                    <el-select
                        v-model="model.data.flags"
                        allow-create
                        filterable
                        placeholder="选择或输入"
                    >
                        <el-option label="S" value="S" />
                        <el-option label="A" value="A" />
                        <el-option label="U" value="U" />
                        <el-option label="P" value="P" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isNAPTR" prop="data.service">
                    <template #label
                        ><span><FontAwesomeIcon icon="font" /> Service</span></template
                    >
                    <el-input v-model="model.data.service" placeholder="例如: sip+E2U" />
                </el-form-item>
                <el-form-item v-if="isNAPTR" prop="data.regex">
                    <template #label
                        ><span><FontAwesomeIcon icon="font" /> Regexp</span></template
                    >
                    <el-input
                        v-model="model.data.regex"
                        placeholder="例如: !^.*$!sip:info@example.com!"
                    />
                </el-form-item>
                <el-form-item v-if="isNAPTR" prop="data.replacement">
                    <template #label
                        ><span><FontAwesomeIcon icon="font" /> Replacement</span></template
                    >
                    <el-input
                        v-model="model.data.replacement"
                        placeholder="例如: _sip._udp.example.com."
                    />
                </el-form-item>

                <!-- LOC fields -->
                <el-form-item v-if="isLOC" prop="data.latDegrees">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 纬度度</span></template
                    >
                    <el-input-number v-model="model.data.latDegrees" :min="0" :max="90" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.latMinutes">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 纬度分</span></template
                    >
                    <el-input-number v-model="model.data.latMinutes" :min="0" :max="59" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.latSeconds">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 纬度秒</span></template
                    >
                    <el-input-number
                        v-model="model.data.latSeconds"
                        :min="0"
                        :max="59.999"
                        :precision="3"
                    />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.latDirection">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 纬度方向</span></template
                    >
                    <el-select v-model="model.data.latDirection" placeholder="选择">
                        <el-option label="N" value="N" />
                        <el-option label="S" value="S" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.longDegrees">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 经度度</span></template
                    >
                    <el-input-number v-model="model.data.longDegrees" :min="0" :max="180" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.longMinutes">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 经度分</span></template
                    >
                    <el-input-number v-model="model.data.longMinutes" :min="0" :max="59" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.longSeconds">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 经度秒</span></template
                    >
                    <el-input-number
                        v-model="model.data.longSeconds"
                        :min="0"
                        :max="59.999"
                        :precision="3"
                    />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.longDirection">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 经度方向</span></template
                    >
                    <el-select v-model="model.data.longDirection" placeholder="选择">
                        <el-option label="E" value="E" />
                        <el-option label="W" value="W" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.altitude">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 海拔(m)</span></template
                    >
                    <el-input-number v-model="model.data.altitude" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.size">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 大小(m)</span></template
                    >
                    <el-input-number v-model="model.data.size" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.precisionHorz">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 水平精度(m)</span></template
                    >
                    <el-input-number v-model="model.data.precisionHorz" />
                </el-form-item>
                <el-form-item v-if="isLOC" prop="data.precisionVert">
                    <template #label
                        ><span><FontAwesomeIcon icon="globe-asia" /> 垂直精度(m)</span></template
                    >
                    <el-input-number v-model="model.data.precisionVert" />
                </el-form-item>

                <!-- URI fields -->
                <el-form-item v-if="isURI" prop="data.priority">
                    <template #label
                        ><span><FontAwesomeIcon icon="sort-numeric-up" /> Priority</span></template
                    >
                    <el-input-number v-model="model.data.priority" :min="0" :max="65535" />
                </el-form-item>
                <el-form-item v-if="isURI" prop="data.weight">
                    <template #label
                        ><span><FontAwesomeIcon icon="sort-numeric-up" /> Weight</span></template
                    >
                    <el-input-number v-model="model.data.weight" :min="0" :max="65535" />
                </el-form-item>
                <el-form-item v-if="isURI" prop="data.target">
                    <template #label
                        ><span><FontAwesomeIcon icon="font" /> Target</span></template
                    >
                    <el-input v-model="model.data.target" placeholder="例如: https://example.com" />
                </el-form-item>

                <el-form-item prop="type">
                    <template #label>
                        <span> <FontAwesomeIcon icon="globe-asia" /> 类型 </span>
                    </template>
                    <el-select v-model="model.type" placeholder="选择">
                        <el-option
                            v-for="(item, index) in dnsTypes"
                            :key="index"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item prop="ttl">
                    <template #label>
                        <span> <FontAwesomeIcon icon="clock" /> TTL </span>
                    </template>
                    <div style="display: grid; grid-row-gap: 10px">
                        <el-input-number v-model="model.ttl" :disabled="model.autoTTL" />

                        <el-switch v-model="model.autoTTL" active-text="自动 TTL" />
                    </div>
                </el-form-item>
                <el-form-item v-if="canBeProxied" prop="proxied">
                    <template #label>
                        <span> <FontAwesomeIcon icon="cloud" /> 代理 </span>
                    </template>
                    <el-checkbox v-model="model.proxied"> Cloudflare CDN </el-checkbox>
                </el-form-item>
                <el-form-item prop="comment">
                    <template #label>
                        <span> <FontAwesomeIcon icon="comment" /> 备注 </span>
                    </template>
                    <el-input
                        v-model="model.comment"
                        type="textarea"
                        :rows="2"
                        placeholder="可选的记录备注"
                    />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" :loading="isLoading" @click="createRecord"
                    >保存</el-button
                >
                <el-button @click="handleClose">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
// import { Vue, Component, Prop } from 'vue-property-decorator'
import { DnsRecordTypeEnum } from "@/api/enum";
import { createDnsRecord, putRecord } from "@/api/dns";
import { DnsRecordType, CloudflareDnsRecord } from "@/api";
import type { FormInstance, FormRules, FormItemRule } from "element-plus";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineOptions({ name: "DnsRecordModal" });
const ruleFormRef = ref<FormInstance>();
const emits = defineEmits<{
    (event: "close"): void;
    (event: "success"): void;
}>();

const props = withDefaults(
    defineProps<{
        zone: string;
    }>(),
    {},
);

type RecordModalType = {
    name: string;
    content?: string;
    type: DnsRecordType;
    ttl: number;
    autoTTL?: boolean;
    proxied: boolean;
    priority?: number;
    data: RecordData;
    comment?: string;
};

type RecordData = {
    weight?: number;
    port?: number;
    target?: string;
    priority?: number;
    flags?: number | string;
    tag?: string;
    value?: string;
    // DS record fields
    keyTag?: number;
    algorithm?: number;
    digestType?: number;
    digest?: string;
    // DNSKEY record fields
    protocol?: number;
    publicKey?: string;
    // CERT record fields
    type?: number;
    certificate?: string;
    // SSHFP record fields
    fingerprint?: string;
    // TLSA / SMIMEA record fields
    usage?: number;
    selector?: number;
    matchingType?: number;
    // NAPTR record fields
    order?: number;
    preference?: number;
    service?: string;
    regex?: string;
    replacement?: string;
    // LOC record fields
    latDegrees?: number;
    latMinutes?: number;
    latSeconds?: number;
    latDirection?: string;
    longDegrees?: number;
    longMinutes?: number;
    longSeconds?: number;
    longDirection?: string;
    altitude?: number;
    size?: number;
    precisionHorz?: number;
    precisionVert?: number;
};

type RecordRequest = Omit<RecordModalType, "data"> & {
    data?: RecordData;
};

const DefaultModalValue: RecordModalType = {
    name: "",
    content: "",
    type: "A" as DnsRecordType,
    ttl: 300,
    autoTTL: true,
    proxied: false,
    priority: 0,
    data: {
        weight: 0,
        port: 0,
        target: "",
        priority: 0,
        flags: 0,
        tag: "issue",
        value: "",
        keyTag: 0,
        algorithm: 13,
        digestType: 2,
        digest: "",
        protocol: 3,
        publicKey: "",
        type: 1,
        certificate: "",
        fingerprint: "",
        usage: 3,
        selector: 1,
        matchingType: 1,
        order: 0,
        preference: 0,
        service: "",
        regex: "",
        replacement: "",
        latDegrees: 0,
        latMinutes: 0,
        latSeconds: 0,
        latDirection: "N",
        longDegrees: 0,
        longMinutes: 0,
        longSeconds: 0,
        longDirection: "E",
        altitude: 0,
        size: 0,
        precisionHorz: 0,
        precisionVert: 0,
    },
    comment: "",
};

const isLoading = ref(false);
const dialogVisible = ref(false);
const record: Ref<CloudflareDnsRecord | null> = ref(null);

const model = ref(DefaultModalValue);

const requirePriority = computed(() => {
    return (
        model.value.type === "MX" ||
        model.value.type === "SRV" ||
        model.value.type === "URI" ||
        isHTTPSSVCB.value
    );
});

const isSRV = computed(() => {
    return model.value.type === "SRV";
});

const isCAA = computed(() => {
    return model.value.type === "CAA";
});

const isHTTPSSVCB = computed(() => {
    return model.value.type === "HTTPS" || model.value.type === "SVCB";
});

const isDS = computed(() => {
    return model.value.type === "DS";
});

const isDNSKEY = computed(() => model.value.type === "DNSKEY");
const isCERT = computed(() => model.value.type === "CERT");
const isSSHFP = computed(() => model.value.type === "SSHFP");
const isTLSA = computed(() => model.value.type === "TLSA");
const isSMIMEA = computed(() => model.value.type === "SMIMEA");
const isTLSAorSMIMEA = computed(() => isTLSA.value || isSMIMEA.value);
const isNAPTR = computed(() => model.value.type === "NAPTR");
const isLOC = computed(() => model.value.type === "LOC");
const isURI = computed(() => model.value.type === "URI");

const canBeProxied = computed(() => {
    return model.value.type === "A" || model.value.type === "AAAA" || model.value.type === "CNAME";
});

const hasStructuredForm = computed(() => {
    return (
        isSRV.value ||
        isCAA.value ||
        isHTTPSSVCB.value ||
        isDS.value ||
        isDNSKEY.value ||
        isCERT.value ||
        isSSHFP.value ||
        isTLSAorSMIMEA.value ||
        isNAPTR.value ||
        isLOC.value ||
        isURI.value
    );
});

// Reset conflicting defaults when record type changes
watch(
    () => model.value.type,
    (newType) => {
        // Clear content validation when switching to structured form types
        nextTick(() => {
            ruleFormRef.value?.clearValidate(["content"]);
        });

        if (newType === "SSHFP" && ![1, 2, 3, 4, 6].includes(model.value.data.algorithm ?? 0)) {
            model.value.data.algorithm = 1;
        }
        if (newType === "NAPTR" && typeof model.value.data.flags !== "string") {
            model.value.data.flags = "S";
        }
        if (
            newType === "DNSKEY" &&
            model.value.data.flags !== 256 &&
            model.value.data.flags !== 257
        ) {
            model.value.data.flags = 256;
        }
    },
);

const dnsTypes = computed(() => {
    return Object.keys(DnsRecordTypeEnum);
});

const isEditMode = computed(() => {
    return !!record.value;
});

const modeLocale = computed(() => {
    return isEditMode.value ? "修改" : "新建";
});

function display() {
    dialogVisible.value = true;
}

function handleClose() {
    dialogVisible.value = false;
    emits("close");
}

const validationRules = computed<FormRules>(() => {
    const t = model.value.type;
    // data.flags: CAA(数字 0-255) / DNSKEY(256|257) / NAPTR(字符串)
    let flagsRules: FormItemRule[] = [];
    if (t === "CAA") {
        flagsRules = [
            { required: true, message: "请输入 CAA Flags", trigger: "blur" },
            {
                type: "number",
                min: 0,
                max: 255,
                message: "CAA Flags 需要是 0 到 255 之间的数字",
                trigger: "blur",
            },
        ];
    } else if (t === "DNSKEY") {
        flagsRules = [{ required: true, message: "请选择 DNSKEY Flags", trigger: "change" }];
    } else if (t === "NAPTR") {
        flagsRules = [{ required: true, message: "请选择 NAPTR Flags", trigger: "change" }];
    }
    // data.value: CAA / HTTPS / SVCB
    let valueRules: FormItemRule[] = [];
    if (t === "CAA") {
        valueRules = [{ required: true, message: "请输入 CAA Value", trigger: "blur" }];
    } else if (t === "HTTPS" || t === "SVCB") {
        valueRules = [{ required: false }];
    }
    return {
        name: [{ required: true, message: "请输入记录名称", trigger: "blur" }],
        "data.flags": flagsRules,
        "data.tag": [{ required: true, message: "请输入 CAA Tag", trigger: "blur" }],
        "data.value": valueRules,
        ttl: [
            { required: true, message: "请输入记录 TTL", trigger: "blur" },
            { type: "number", message: "TTL 需要是一个数字", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入记录类型", trigger: "blur" }],
    };
});

function setRecord(r: CloudflareDnsRecord) {
    record.value = r;
}

function reset() {
    model.value = JSON.parse(JSON.stringify(DefaultModalValue));
    record.value = null;
}

function setModel(m: Partial<RecordModalType>) {
    model.value = Object.assign(model.value, m);
}

async function createRecord() {
    const valid = await ruleFormRef.value?.validate();
    if (!valid) {
        return;
    }

    // Manual content validation for non-structured types
    if (!hasStructuredForm.value && !isCAA.value && !isHTTPSSVCB.value && !model.value.content) {
        ElMessage.warning("请输入记录值");
        return;
    }

    // Validation for structured record types
    if (isDNSKEY.value && !model.value.data.publicKey) {
        ElMessage.warning("请填写公钥");
        return;
    }
    if (isDNSKEY.value && model.value.data.flags !== 256 && model.value.data.flags !== 257) {
        ElMessage.warning("请选择 DNSKEY Flags");
        return;
    }
    if (isCERT.value && !model.value.data.certificate) {
        ElMessage.warning("请填写证书内容");
        return;
    }
    if (isSSHFP.value && !model.value.data.fingerprint) {
        ElMessage.warning("请填写指纹");
        return;
    }
    if (isSSHFP.value && ![1, 2, 3, 4, 6].includes(model.value.data.algorithm ?? 0)) {
        ElMessage.warning("请选择 SSHFP 算法");
        return;
    }
    if (isTLSAorSMIMEA.value && !model.value.data.certificate) {
        ElMessage.warning("请填写证书/公钥内容");
        return;
    }
    if (isNAPTR.value && !model.value.data.flags) {
        ElMessage.warning("请选择 NAPTR Flags");
        return;
    }
    if (isNAPTR.value && !model.value.data.service) {
        ElMessage.warning("请填写 Service");
        return;
    }
    if (isNAPTR.value && !model.value.data.replacement) {
        ElMessage.warning("请填写 Replacement");
        return;
    }
    if (isLOC.value && !model.value.data.latDirection) {
        ElMessage.warning("请选择纬度方向");
        return;
    }
    if (isLOC.value && !model.value.data.longDirection) {
        ElMessage.warning("请选择经度方向");
        return;
    }
    if (isURI.value && !model.value.data.target) {
        ElMessage.warning("请填写目标 URI");
        return;
    }

    isLoading.value = true;

    const submit = async (doc: RecordRequest) => {
        if (isEditMode.value) {
            if (!record.value) {
                return;
            }
            return await putRecord(props.zone, record.value.id, doc);
        } else {
            return await createDnsRecord(props.zone, doc);
        }
    };

    const requestBody: RecordRequest = {
        name: model.value.name,
        type: model.value.type,
        ttl: model.value.autoTTL ? 1 : model.value.ttl,
        proxied: canBeProxied.value ? model.value.proxied : false,
        comment: model.value.comment,
    };

    if (!hasStructuredForm.value) {
        requestBody.content = model.value.content;
    }

    if (requirePriority.value) {
        requestBody.priority = model.value.priority;
    }
    if (isSRV.value) {
        requestBody.data = {
            port: model.value.data.port,
            weight: model.value.data.weight,
            target: model.value.data.target,
            priority: model.value.priority,
        };
    }
    if (isCAA.value) {
        requestBody.data = {
            flags: model.value.data.flags ?? 0,
            tag: model.value.data.tag ?? "issue",
            value: model.value.data.value ?? "",
        };
    }
    if (isHTTPSSVCB.value) {
        requestBody.data = {
            priority: model.value.priority,
            target: model.value.data.target ?? ".",
            value: model.value.data.value ?? "",
        };
    }
    if (isDS.value) {
        requestBody.data = {
            keyTag: model.value.data.keyTag,
            algorithm: model.value.data.algorithm,
            digestType: model.value.data.digestType,
            digest: model.value.data.digest,
        };
    }
    if (isDNSKEY.value) {
        requestBody.data = {
            flags: model.value.data.flags,
            protocol: 3,
            algorithm: model.value.data.algorithm,
            publicKey: model.value.data.publicKey,
        };
    }
    if (isCERT.value) {
        requestBody.data = {
            type: model.value.data.type,
            keyTag: model.value.data.keyTag,
            algorithm: model.value.data.algorithm,
            certificate: model.value.data.certificate,
        };
    }
    if (isSSHFP.value) {
        requestBody.data = {
            algorithm: model.value.data.algorithm,
            type: model.value.data.type,
            fingerprint: model.value.data.fingerprint,
        };
    }
    if (isTLSAorSMIMEA.value) {
        requestBody.data = {
            usage: model.value.data.usage,
            selector: model.value.data.selector,
            matchingType: model.value.data.matchingType,
            certificate: model.value.data.certificate,
        };
    }
    if (isNAPTR.value) {
        requestBody.data = {
            order: model.value.data.order,
            preference: model.value.data.preference,
            flags: model.value.data.flags,
            service: model.value.data.service,
            regex: model.value.data.regex,
            replacement: model.value.data.replacement,
        };
    }
    if (isLOC.value) {
        requestBody.data = {
            latDegrees: model.value.data.latDegrees,
            latMinutes: model.value.data.latMinutes,
            latSeconds: model.value.data.latSeconds,
            latDirection: model.value.data.latDirection,
            longDegrees: model.value.data.longDegrees,
            longMinutes: model.value.data.longMinutes,
            longSeconds: model.value.data.longSeconds,
            longDirection: model.value.data.longDirection,
            altitude: model.value.data.altitude,
            size: model.value.data.size,
            precisionHorz: model.value.data.precisionHorz,
            precisionVert: model.value.data.precisionVert,
        };
    }
    if (isURI.value) {
        requestBody.data = {
            priority: model.value.data.priority,
            weight: model.value.data.weight,
            target: model.value.data.target,
        };
    }

    const res = await submit(requestBody);

    if (!res) {
        emits("success");
        ElMessage(`${modeLocale.value}成功, 正在刷新`);
        handleClose();
    } else {
        ElMessage({
            type: "error",
            message: `${modeLocale.value}失败, 消息: ${res}`,
        });
    }

    isLoading.value = false;
}

defineExpose({
    display,
    reset,
    setModel,
    setRecord,
});
</script>
